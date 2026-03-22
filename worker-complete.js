// ════════════════════════════════════════════════════════════
// CYCLING PLANNER WORKER — cycylingplanner.rewardspy.workers.dev
// Add ALL of this to your existing worker, replacing the full file.
// ════════════════════════════════════════════════════════════

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    // ── GET /api/destination?dest=NAME ────────────────────────
    // Returns pre-generated KV data for a destination.
    // Falls back to live AI generation if not in KV, then caches.
    if (url.pathname === "/api/destination") {
      const name = url.searchParams.get("dest");
      if (!name) {
        return new Response(JSON.stringify({ error: "Missing dest param" }), {
          status: 400, headers: CORS
        });
      }

      // Try KV cache first — instant, free
      try {
        const cached = await env.DEST_DATA.get(`dest:${name}`);
        if (cached) {
          return new Response(cached, {
            headers: {
              ...CORS,
              "Cache-Control": "public, max-age=86400",
              "X-Data-Source": "kv-cache",
            }
          });
        }
      } catch (e) {
        console.error("KV read error:", e);
      }

      // KV miss — generate live and cache for next time
      try {
        const data = await generateDestinationData(name, env);
        const json = JSON.stringify(data);

        // Store in KV async (don't wait for it)
        ctx.waitUntil(
          env.DEST_DATA.put(`dest:${name}`, json, {
            expirationTtl: 31536000 // 1 year
          })
        );

        return new Response(json, {
          headers: { ...CORS, "X-Data-Source": "ai-generated" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500, headers: CORS
        });
      }
    }

    // ── GET /api/reviews?route=NAME ───────────────────────────
    if (url.pathname === "/api/reviews" && request.method === "GET") {
      const route = url.searchParams.get("route");
      if (!route) return new Response("[]", { headers: CORS });
      try {
        const data = await env.DEST_DATA.get(`reviews:${route}`);
        return new Response(data || "[]", { headers: CORS });
      } catch (e) {
        return new Response("[]", { headers: CORS });
      }
    }

    // ── POST /api/reviews ─────────────────────────────────────
    if (url.pathname === "/api/reviews" && request.method === "POST") {
      try {
        const body = await request.json();
        const { routeName, userEmail, overallRating, text } = body;

        if (!routeName || !userEmail || !overallRating || !text) {
          return new Response(JSON.stringify({ error: "Missing required fields" }), {
            status: 400, headers: CORS
          });
        }
        if (text.length < 20 || text.length > 5000) {
          return new Response(JSON.stringify({ error: "Review must be 20-5000 chars" }), {
            status: 400, headers: CORS
          });
        }

        const key = `reviews:${routeName}`;
        const existing = await env.DEST_DATA.get(key);
        const reviews = existing ? JSON.parse(existing) : [];

        if (reviews.some(r => r.userEmail === userEmail)) {
          return new Response(JSON.stringify({ error: "Already reviewed" }), {
            status: 409, headers: CORS
          });
        }

        const review = {
          routeName: String(body.routeName).slice(0, 200),
          userEmail: String(body.userEmail).slice(0, 200),
          title: String(body.title || "").slice(0, 200),
          text: String(body.text).slice(0, 5000),
          overallRating: Math.min(5, Math.max(1, parseInt(body.overallRating))),
          roadQuality: body.roadQuality ? Math.min(5, Math.max(1, parseInt(body.roadQuality))) : null,
          scenery: body.scenery ? Math.min(5, Math.max(1, parseInt(body.scenery))) : null,
          traffic: body.traffic ? Math.min(5, Math.max(1, parseInt(body.traffic))) : null,
          difficultyAccuracy: body.difficultyAccuracy ? Math.min(5, Math.max(1, parseInt(body.difficultyAccuracy))) : null,
          tags: Array.isArray(body.tags) ? body.tags.slice(0, 5) : [],
          rideDate: String(body.rideDate || "").slice(0, 20),
          riddenDistance: body.riddenDistance ? parseFloat(body.riddenDistance) : null,
          biketype: String(body.biketype || "").slice(0, 50),
          stravaActivity: String(body.stravaActivity || "").startsWith("https://www.strava.com")
            ? String(body.stravaActivity).slice(0, 200) : "",
          createdAt: new Date().toISOString(),
        };

        reviews.unshift(review);
        if (reviews.length > 500) reviews.splice(500);

        await env.DEST_DATA.put(key, JSON.stringify(reviews), {
          expirationTtl: 157680000 // 5 years
        });

        return new Response(JSON.stringify({ success: true }), {
          status: 201, headers: CORS
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500, headers: CORS
        });
      }
    }

    // ── POST /api/chat ────────────────────────────────────────
    // Legacy AI route planner — still used as fallback
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { messages, system } = await request.json();
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 2000,
            system: system || "You are a cycling travel expert.",
            messages,
          }),
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), { headers: CORS });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500, headers: CORS
        });
      }
    }

    // ── GET /api/status ───────────────────────────────────────
    if (url.pathname === "/api/status") {
      return new Response(JSON.stringify({
        status: "ok",
        worker: "cyclingplanner",
        timestamp: new Date().toISOString(),
      }), { headers: CORS });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404, headers: CORS
    });
  }
};

// ── AI destination data generator (fallback for KV misses) ───
async function generateDestinationData(name, env) {
  const prompt = `Generate cycling destination data for "${name}". Return ONLY valid JSON:
{"name":"${name}","hotels":[{"name":"Real hotel","area":"Specific area","pricePerNight":120,"currency":"EUR","stars":4,"cyclistFriendly":true,"highlights":["bike storage","early breakfast"],"bookingUrl":"https://www.booking.com/hotel/","lat":0.0,"lng":0.0,"distanceToRouteStartKm":1.5},{"name":"Budget hotel","area":"Area","pricePerNight":70,"currency":"EUR","stars":3,"cyclistFriendly":true,"highlights":["affordable"],"bookingUrl":"https://www.booking.com/hotel/","lat":0.0,"lng":0.0,"distanceToRouteStartKm":2.0},{"name":"Luxury hotel","area":"Area","pricePerNight":200,"currency":"EUR","stars":5,"cyclistFriendly":true,"highlights":["luxury","spa"],"bookingUrl":"https://www.booking.com/hotel/","lat":0.0,"lng":0.0,"distanceToRouteStartKm":0.5}],"routes":[{"name":"Main route","distance":85,"elevationM":1400,"difficulty":"Hard","type":"Out and back","description":"Description","highlights":["climb","view"],"stravaUrl":"https://www.strava.com/routes/","komootUrl":"https://www.komoot.com/tour/","estimatedTimeHours":3.5,"surfaceType":"Road"},{"name":"Easier route","distance":50,"elevationM":600,"difficulty":"Medium","type":"Loop","description":"Description","highlights":["highlight"],"stravaUrl":"https://www.strava.com/routes/","komootUrl":"https://www.komoot.com/tour/","estimatedTimeHours":2.0,"surfaceType":"Road"},{"name":"Epic route","distance":120,"elevationM":2500,"difficulty":"Very Hard","type":"Out and back","description":"Description","highlights":["epic"],"stravaUrl":"https://www.strava.com/routes/","komootUrl":"https://www.komoot.com/tour/","estimatedTimeHours":6.0,"surfaceType":"Road"}],"airports":[{"code":"XXX","name":"Airport name","distanceKm":25,"transferMinutes":30,"bikeBoxAccepted":true,"note":"Key note"}],"bikeTransport":{"bikeBoxAllowed":true,"bikeHireAvailable":true,"bikeHireQuality":"Good","bikeShops":["Shop name"],"localBikeRental":"Rental info","trainWithBike":"Train options"},"localKnowledge":{"bestCafeStop":"Cafe name","localFuel":"Local food","cultureNotes":"Culture note","insiderTip":"Insider tip","language":"Language info"},"warnings":["Warning 1","Warning 2"],"bestMonthsDetail":{"peak":[5,6,7,8],"shoulder":[4,9],"avoid":[11,12,1,2],"reasoning":"Why these months"},"food":{"signature":"Local dish","postRideRecommendation":"Restaurant","foodCulture":"Food culture"},"stayZone":"Best area","fitness":{"gymNearby":true,"swimmingPool":true,"physiotherapist":true}}
Fill ALL values with real accurate data for ${name}. Return ONLY the JSON.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.content?.[0]?.text) {
    throw new Error("No content in API response");
  }

  const text = data.content[0].text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in response");

  return JSON.parse(match[0]);
}
