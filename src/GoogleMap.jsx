// GoogleMap.jsx — drop-in replacement for Leaflet map
// Shows real hotel pins + bike shop search on Google Maps
// Usage: <GoogleMap dest={selectedDest} hotels={kvData?.hotels} />

import React, { useEffect, useRef, useState } from "react";

const GOOGLE_KEY = "import.meta.env.VITE_GOOGLE_MAPS_KEY";

export default function GoogleMap({ dest, hotels = [], height = 380 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("hotels"); // hotels | bikeshops | routes

  // Load Google Maps JS API
  useEffect(() => {
    if (window.google?.maps) { setLoaded(true); return; }
    if (document.getElementById("google-maps-script")) return;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialise map when loaded
  useEffect(() => {
    if (!loaded || !mapRef.current || !dest) return;

    const lat = dest.lat || 41.98;
    const lng = dest.lng || 2.82;
    const center = { lat, lng };

    // Create map
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      mapTypeId: "roadmap",
      styles: darkMapStyles,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
    mapInstanceRef.current = map;

    // Add hotel markers
    const infoWindow = new window.google.maps.InfoWindow();

    hotels.forEach((hotel, i) => {
      if (!hotel.lat || !hotel.lng || hotel.lat === 0) return;

      const marker = new window.google.maps.Marker({
        position: { lat: hotel.lat, lng: hotel.lng },
        map,
        title: hotel.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
              <path d="M16 0C7.2 0 0 7.2 0 16c0 11.2 16 24 16 24s16-12.8 16-24C32 7.2 24.8 0 16 0z" fill="#E8B84B"/>
              <text x="16" y="21" font-size="14" text-anchor="middle" fill="#0a0a09" font-weight="bold" font-family="Arial">H</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(32, 40),
          anchor: new window.google.maps.Point(16, 40),
        },
      });

      marker.addListener("click", () => {
        const stars = hotel.rating ? `⭐ ${hotel.rating} (${hotel.reviewCount || 0} reviews)` : "";
        const price = hotel.priceLevelText || "";
        infoWindow.setContent(`
          <div style="font-family:Arial,sans-serif;max-width:220px;padding:4px">
            <strong style="font-size:14px">${hotel.name}</strong><br>
            <span style="color:#666;font-size:12px">${hotel.area || ""}</span><br>
            ${stars ? `<span style="font-size:12px">${stars}</span><br>` : ""}
            ${price ? `<span style="font-size:12px;color:#888">${price}</span><br>` : ""}
            <div style="margin-top:8px;display:flex;gap:6px">
              <a href="${hotel.googleMapsUrl}" target="_blank"
                style="background:#1A6FBF;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;text-decoration:none">
                Google Maps
              </a>
              <a href="${hotel.bookingSearchUrl}" target="_blank"
                style="background:#003580;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;text-decoration:none">
                Booking.com
              </a>
            </div>
          </div>
        `);
        infoWindow.open(map, marker);
      });
    });

    // If tab is bikeshops, search for them
    if (tab === "bikeshops") {
      const service = new window.google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: center,
        radius: 5000,
        keyword: "bike shop cycling",
      }, (results, status) => {
        if (status === "OK" && results) {
          results.slice(0, 5).forEach(place => {
            const marker = new window.google.maps.Marker({
              position: place.geometry.location,
              map,
              title: place.name,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
                    <path d="M16 0C7.2 0 0 7.2 0 16c0 11.2 16 24 16 24s16-12.8 16-24C32 7.2 24.8 0 16 0z" fill="#2D9B83"/>
                    <text x="16" y="21" font-size="12" text-anchor="middle" fill="#fff" font-weight="bold" font-family="Arial">🚲</text>
                  </svg>
                `)}`,
                scaledSize: new window.google.maps.Size(28, 36),
                anchor: new window.google.maps.Point(14, 36),
              },
            });
            marker.addListener("click", () => {
              infoWindow.setContent(`
                <div style="font-family:Arial,sans-serif;padding:4px">
                  <strong>${place.name}</strong><br>
                  <span style="color:#666;font-size:12px">${place.vicinity || ""}</span><br>
                  ${place.rating ? `⭐ ${place.rating}` : ""}
                </div>
              `);
              infoWindow.open(map, marker);
            });
          });
        }
      });
    }

  }, [loaded, dest, hotels, tab]);

  if (!dest) return null;

  const embedUrl = `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_KEY}` +
    `&q=${encodeURIComponent(tab === "bikeshops" ? `bike shop ${dest.name}` : `hotels ${dest.name}`)}` +
    (dest.lat ? `&center=${dest.lat},${dest.lng}&zoom=13` : "");

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", background: "rgba(0,0,0,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        {[
          { key: "hotels", label: "🏨 Hotels" },
          { key: "bikeshops", label: "🚲 Bike shops" },
          { key: "routes", label: "🗺 Route area" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "10px 0",
            background: tab === key ? "rgba(232,184,75,0.15)" : "transparent",
            border: "none",
            borderBottom: tab === key ? "2px solid #E8B84B" : "2px solid transparent",
            color: tab === key ? "#E8B84B" : "#666",
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Map — use iframe embed (works without JS API loading) */}
      <iframe
        title={`${dest.name} map`}
        width="100%"
        height={height}
        style={{ display: "block", border: "none" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={tab === "routes"
          ? `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_KEY}&center=${dest.lat || 0},${dest.lng || 0}&zoom=11&maptype=terrain`
          : embedUrl
        }
      />

      {/* Links below map */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 16px", background: "rgba(0,0,0,0.3)",
      }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555" }}>
          {tab === "hotels" ? `${hotels.filter(h=>h.googlePlaceId).length} verified hotels` : tab === "bikeshops" ? "Local bike shops" : "Terrain view"}
        </span>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(
            tab === "bikeshops" ? `bike shop ${dest.name}` :
            tab === "routes" ? `cycling routes ${dest.name}` :
            `hotels ${dest.name}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            color: "#E8B84B", textDecoration: "none",
          }}
        >
          Open in Google Maps →
        </a>
      </div>
    </div>
  );
}

// Dark map styles matching app theme
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
];
