// RouteReviews.jsx
// Drop this into src/ and import in App.jsx
// Allows logged-in users to rate and review any cycling route

import React, { useState, useEffect } from "react";

const WORKER = "https://cycylingplanner.rewardspy.workers.dev";

// ── Star Rating Component ─────────────────────────────────────────
function StarRating({ value, onChange, readonly = false, size = 20 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            fontSize: size,
            cursor: readonly ? "default" : "pointer",
            color: star <= (hover || value) ? "#E8B84B" : "#333",
            transition: "color 0.15s",
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ── Individual Review Card ────────────────────────────────────────
function ReviewCard({ review }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      padding: "16px 18px",
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `hsl(${review.userEmail.charCodeAt(0) * 7 % 360}, 60%, 40%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#fff",
              fontFamily: "'DM Mono', monospace",
            }}>
              {review.userEmail[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#ccc" }}>
                {review.userEmail.split("@")[0]}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555" }}>
                {date}
              </div>
            </div>
          </div>
        </div>
        <StarRating value={review.overallRating} readonly size={16} />
      </div>

      {review.title && (
        <div style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 6 }}>
          {review.title}
        </div>
      )}

      <div style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 13, color: "#aaa", lineHeight: 1.6, marginBottom: 10 }}>
        {review.text}
      </div>

      {/* Sub-ratings */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
        {[
          { label: "Road quality", value: review.roadQuality },
          { label: "Scenery", value: review.scenery },
          { label: "Traffic", value: review.traffic },
          { label: "Difficulty accuracy", value: review.difficultyAccuracy },
        ].map(({ label, value }) => value ? (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
            <StarRating value={value} readonly size={12} />
          </div>
        ) : null)}
      </div>

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {review.tags.map((tag) => (
            <span key={tag} style={{
              background: "rgba(232,184,75,0.12)",
              border: "1px solid rgba(232,184,75,0.25)",
              borderRadius: 20,
              padding: "2px 10px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "#E8B84B",
            }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Stats they rode */}
      {(review.rideDate || review.riddenDistance || review.biketype) && (
        <div style={{
          marginTop: 10,
          padding: "8px 12px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: 6,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}>
          {review.rideDate && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666" }}>
              📅 Rode: {review.rideDate}
            </span>
          )}
          {review.riddenDistance && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666" }}>
              📏 {review.riddenDistance}km
            </span>
          )}
          {review.biketype && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666" }}>
              🚴 {review.biketype}
            </span>
          )}
          {review.stravaActivity && (
            <a href={review.stravaActivity} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#FC4C02", textDecoration: "none" }}>
              🟠 Strava activity →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── Write Review Form ─────────────────────────────────────────────
function WriteReviewForm({ routeName, userEmail, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    text: "",
    overallRating: 0,
    roadQuality: 0,
    scenery: 0,
    traffic: 0,
    difficultyAccuracy: 0,
    rideDate: "",
    riddenDistance: "",
    biketype: "",
    stravaActivity: "",
    tags: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const AVAILABLE_TAGS = [
    "Epic scenery", "Well signposted", "Heavy traffic", "Quiet roads",
    "Cafe stop essential", "Technical descent", "Gravel sections",
    "Best in morning", "Dog problem", "Worth every metre",
    "Overrated", "Hidden gem", "Must do", "Brutal climb",
    "Family friendly", "Pro training ground",
  ];

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter(t => t !== tag)
        : f.tags.length < 5 ? [...f.tags, tag] : f.tags,
    }));
  };

  const handleSubmit = async () => {
    if (!form.overallRating) { setError("Please add an overall rating"); return; }
    if (!form.text.trim()) { setError("Please write something about the route"); return; }
    if (form.text.trim().length < 30) { setError("Review must be at least 30 characters"); return; }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ ...form, routeName, userEmail, createdAt: new Date().toISOString() });
    } catch (e) {
      setError("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{
          width: "100%", background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
          padding: "9px 12px", color: "#fff", fontSize: 13,
          fontFamily: "'Helvetica Neue', sans-serif", outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(232,184,75,0.2)",
      borderRadius: 12,
      padding: "20px 22px",
      marginBottom: 20,
    }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#E8B84B", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
        Write a review for {routeName}
      </div>

      {/* Overall rating */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Overall rating *
        </div>
        <StarRating value={form.overallRating} onChange={v => setForm(f => ({ ...f, overallRating: v }))} size={28} />
      </div>

      {/* Sub ratings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Road quality", key: "roadQuality" },
          { label: "Scenery", key: "scenery" },
          { label: "Traffic level", key: "traffic" },
          { label: "Difficulty accuracy", key: "difficultyAccuracy" },
        ].map(({ label, key }) => (
          <div key={key}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
            <StarRating value={form[key]} onChange={v => setForm(f => ({ ...f, [key]: v }))} size={18} />
          </div>
        ))}
      </div>

      {field("Review title", "title", "text", "e.g. Best climb in Spain")}

      {/* Review text */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
          Your review *
        </label>
        <textarea
          value={form.text}
          onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
          placeholder="What was the route like? Any tips for other cyclists? Would you recommend it?"
          rows={4}
          style={{
            width: "100%", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
            padding: "9px 12px", color: "#fff", fontSize: 13,
            fontFamily: "'Helvetica Neue', sans-serif", outline: "none",
            resize: "vertical", boxSizing: "border-box",
          }}
        />
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: form.text.length < 30 ? "#666" : "#2D9B83", marginTop: 4 }}>
          {form.text.length} chars {form.text.length < 30 ? `(${30 - form.text.length} more needed)` : "✓"}
        </div>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Tags (up to 5)
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {AVAILABLE_TAGS.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)} style={{
              background: form.tags.includes(tag) ? "rgba(232,184,75,0.2)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${form.tags.includes(tag) ? "rgba(232,184,75,0.5)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 20, padding: "4px 12px",
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              color: form.tags.includes(tag) ? "#E8B84B" : "#666",
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Ride details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {field("When did you ride it?", "rideDate", "month", "")}
        {field("Distance ridden (km)", "riddenDistance", "number", "85")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {field("Bike type", "biketype", "text", "Road / Gravel / MTB")}
        {field("Strava activity URL", "stravaActivity", "url", "https://strava.com/activities/...")}
      </div>

      {error && (
        <div style={{ color: "#DB7B7B", fontFamily: "'DM Mono', monospace", fontSize: 12, marginBottom: 12 }}>
          ⚠ {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={handleSubmit} disabled={submitting} style={{
          background: "#E8B84B", color: "#0a0a09", border: "none",
          borderRadius: 6, padding: "10px 20px",
          fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700,
          cursor: submitting ? "not-allowed" : "pointer",
          opacity: submitting ? 0.6 : 1,
        }}>
          {submitting ? "Submitting..." : "Submit review"}
        </button>
        <button onClick={onCancel} style={{
          background: "transparent", color: "#666",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 6, padding: "10px 20px",
          fontFamily: "'DM Mono', monospace", fontSize: 12,
          cursor: "pointer",
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main RouteReviews Component ───────────────────────────────────
export default function RouteReviews({ routeName, userEmail, isLoggedIn }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const storageKey = `reviews_${routeName}`;

  // Load reviews from localStorage (client-side) + worker KV (server-side)
  useEffect(() => {
    setLoading(true);
    // Load from localStorage first (instant)
    try {
      const local = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setReviews(local);
    } catch (e) {}

    // Then fetch from worker
    fetch(`${WORKER}/api/reviews?route=${encodeURIComponent(routeName)}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [routeName]);

  const submitReview = async (reviewData) => {
    // Save locally immediately
    const newReviews = [reviewData, ...reviews];
    setReviews(newReviews);
    try { localStorage.setItem(storageKey, JSON.stringify(newReviews)); } catch (e) {}

    // Send to worker
    await fetch(`${WORKER}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    setWriting(false);
    setSubmitted(true);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "highest") return b.overallRating - a.overallRating;
    if (sortBy === "lowest") return a.overallRating - b.overallRating;
    return 0;
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length).toFixed(1)
    : null;

  const hasUserReviewed = reviews.some(r => r.userEmail === userEmail);

  return (
    <div style={{ marginTop: 32 }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16, paddingBottom: 12,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#E8B84B", textTransform: "uppercase", letterSpacing: 2 }}>
            Route reviews
          </div>
          {avgRating && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <StarRating value={Math.round(parseFloat(avgRating))} readonly size={16} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#fff" }}>
                {avgRating} <span style={{ color: "#555" }}>({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
              </span>
            </div>
          )}
        </div>

        {isLoggedIn && !writing && !hasUserReviewed && (
          <button onClick={() => setWriting(true)} style={{
            background: "rgba(232,184,75,0.1)",
            border: "1px solid rgba(232,184,75,0.3)",
            borderRadius: 6, padding: "8px 16px",
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: "#E8B84B", cursor: "pointer",
            transition: "all 0.2s",
          }}>
            ✏ Write a review
          </button>
        )}

        {!isLoggedIn && (
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555" }}>
            Sign in to write a review
          </div>
        )}
      </div>

      {submitted && (
        <div style={{
          background: "rgba(45,155,131,0.1)", border: "1px solid rgba(45,155,131,0.3)",
          borderRadius: 8, padding: "12px 16px", marginBottom: 16,
          fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#2D9B83",
        }}>
          ✓ Review submitted — thank you!
        </div>
      )}

      {writing && (
        <WriteReviewForm
          routeName={routeName}
          userEmail={userEmail}
          onSubmit={submitReview}
          onCancel={() => setWriting(false)}
        />
      )}

      {/* Sort controls */}
      {reviews.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["newest", "highest", "lowest"].map(s => (
            <button key={s} onClick={() => setSortBy(s)} style={{
              background: sortBy === s ? "rgba(255,255,255,0.08)" : "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: "4px 12px",
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              color: sortBy === s ? "#fff" : "#555",
              cursor: "pointer", textTransform: "capitalize",
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Reviews list */}
      {loading && (
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#444", padding: "12px 0" }}>
          Loading reviews...
        </div>
      )}

      {!loading && reviews.length === 0 && !writing && (
        <div style={{
          textAlign: "center", padding: "24px 0",
          fontFamily: "'Helvetica Neue', sans-serif", fontSize: 13, color: "#555",
        }}>
          No reviews yet.
          {isLoggedIn ? " Be the first to review this route." : " Sign in to be the first."}
        </div>
      )}

      {sortedReviews.map((r, i) => (
        <ReviewCard key={`${r.userEmail}-${r.createdAt}-${i}`} review={r} />
      ))}
    </div>
  );
}
