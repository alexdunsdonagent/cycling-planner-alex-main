import React from "react";

/**
 * Hotel display card shown in the results panel.
 *
 * Props:
 *   hotel  — hotel object { name, stars, source, rating, reviewCount, price, type, town, whyCyclists, url }
 *   style  — extra inline styles (optional)
 */
export default function HotelCard({ hotel: h, style }) {
  if (!h) return null;

  const isSC = h.source === "SelfCatering.co.uk" || h.source === "Airbnb";
  const srcColor = isSC
    ? "#9b7ed4"
    : h.source === "Booking.com"
    ? "#4a9eff"
    : h.source === "Hotels.com"
    ? "#ff6b6b"
    : "#ff8c42";
  const srcBg = isSC
    ? "rgba(155,126,212,0.1)"
    : h.source === "Booking.com"
    ? "rgba(74,158,255,0.1)"
    : h.source === "Hotels.com"
    ? "rgba(255,107,107,0.1)"
    : "rgba(255,140,66,0.1)";
  const ctaBg = isSC
    ? "rgba(155,126,212,0.18)"
    : h.source === "Booking.com"
    ? "rgba(74,158,255,0.18)"
    : h.source === "Hotels.com"
    ? "rgba(255,107,107,0.18)"
    : "rgba(255,140,66,0.18)";
  const ctaBorder = isSC
    ? "rgba(155,126,212,0.5)"
    : h.source === "Booking.com"
    ? "rgba(74,158,255,0.5)"
    : h.source === "Hotels.com"
    ? "rgba(255,107,107,0.5)"
    : "rgba(255,140,66,0.5)";

  const ratingNum = parseFloat((h.rating || "").replace(/[^0-9.]/g, "")) || 0;
  const ratingBg =
    ratingNum >= 9 ? "#1a3018" : ratingNum >= 8 ? "#1a2a18" : "#2a2a18";
  const ratingBorder =
    ratingNum >= 9 ? "#2a5028" : ratingNum >= 8 ? "#2a4028" : "#3a3a20";
  const ratingColor =
    ratingNum >= 9 ? "#4aaa40" : ratingNum >= 8 ? "#66bb6a" : "#e8b84b";

  // Clean duplicate "Hotel Hotel" prefix
  const displayName = (h.name || "").replace(/^Hotel Hotel /i, "Hotel ");

  return (
    <div
      className="hotel-card"
      style={{
        marginBottom: "14px",
        padding: "16px 18px",
        background: "#0a0a09",
        borderRadius: "10px",
        border: isSC ? "1px solid rgba(155,126,212,0.3)" : "1px solid #1a1a18",
        ...style,
      }}
    >
      {isSC && (
        <div
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "10px",
            color: "#9b7ed4",
            letterSpacing: "1.5px",
            marginBottom: "8px",
          }}
        >
          SELF-CATERING OPTION
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
          gap: "10px",
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "17px",
            fontWeight: "700",
            color: "#f0ede8",
            lineHeight: 1.3,
            flex: 1,
          }}
        >
          {displayName}
        </div>
        {h.rating && (
          <div
            style={{
              flexShrink: 0,
              background: ratingBg,
              border: `1px solid ${ratingBorder}`,
              borderRadius: "5px",
              padding: "4px 10px",
              textAlign: "center",
              minWidth: "48px",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "12px",
                color: ratingColor,
                fontWeight: "600",
                lineHeight: 1,
              }}
            >
              {h.rating}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "10px",
                color: ratingBorder,
                marginTop: "1px",
              }}
            >
              score
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        {h.stars && (
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {Array.from({ length: Math.min(parseInt(h.stars) || 0, 5) }).map(
              (_, si) => (
                <svg
                  key={si}
                  width="11"
                  height="11"
                  viewBox="0 0 10 10"
                  fill="#e8b84b"
                >
                  <polygon points="5,1 6.2,3.8 9.5,3.8 6.9,5.7 7.9,9 5,7.1 2.1,9 3.1,5.7 0.5,3.8 3.8,3.8" />
                </svg>
              )
            )}
            <span
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                color: "#7a7a74",
                marginLeft: "3px",
              }}
            >
              {h.stars}
            </span>
          </div>
        )}
        <span
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "11px",
            color: srcColor,
            background: srcBg,
            border: `1px solid ${srcColor}44`,
            borderRadius: "3px",
            padding: "2px 8px",
          }}
        >
          {h.source}
        </span>
        {h.reviewCount && (
          <span
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "11px",
              color: "#666660",
            }}
          >
            {h.reviewCount}
          </span>
        )}
      </div>

      {h.whyCyclists && (
        <div
          style={{
            padding: "10px 12px",
            background: "rgba(232,184,75,0.04)",
            border: "1px solid rgba(232,184,75,0.1)",
            borderRadius: "6px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#b8943b",
              letterSpacing: "1.5px",
              marginBottom: "5px",
            }}
          >
            WHY CYCLISTS STAY HERE
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#999",
              lineHeight: 1.65,
              fontFamily: "Georgia,serif",
              margin: 0,
            }}
          >
            {h.whyCyclists}
          </p>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "10px",
          borderTop: "1px solid #161614",
        }}
      >
        <div>
          {h.price && (
            <div
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "12px",
                color: "#e8b84b",
                fontWeight: "500",
              }}
            >
              {h.price}
            </div>
          )}
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#333",
              marginTop: "2px",
            }}
          >
            estimate &middot; check for today&rsquo;s rate
          </div>
        </div>
        {h.url && h.url.startsWith("http") ? (
          <a
            href={h.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "12px",
              textDecoration: "none",
              background: ctaBg,
              color: srcColor,
              border: `1px solid ${ctaBorder}`,
              borderRadius: "6px",
              padding: "10px 20px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "none";
            }}
          >
            View hotel <span style={{ fontSize: "14px", lineHeight: 1 }}>↗</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
