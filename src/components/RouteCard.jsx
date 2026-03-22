import React from "react";
import { downloadGpx } from "../utils/gpx";

/**
 * Route display card shown in the results panel.
 * Includes GPX download if waypoints are present.
 *
 * Props:
 *   route       — route object { name, description, dist, elev, difficulty, strava, komoot, waypoints }
 *   destName    — destination name (used to resolve SEO route page link)
 *   seoRoutes   — array of ROUTE_SEO_PAGES entries (passed from parent)
 *   style       — extra inline styles (optional)
 */
export default function RouteCard({ route, destName = "", seoRoutes = [], style }) {
  if (!route) return null;

  const { name, description, dist, elevation, difficulty, strava, komoot, waypoints = [] } = route;

  const diffColor =
    difficulty === "Epic"
      ? "#ff6b6b"
      : difficulty === "Hard"
      ? "#e8b84b"
      : difficulty === "Medium-Hard"
      ? "#c8a838"
      : "#4aaa40";

  const hasGpx = waypoints && waypoints.length >= 2;

  // Find SEO route page for this route + destination
  const seoRoute = seoRoutes.find(
    (p) =>
      name &&
      p.title &&
      p.title.toLowerCase().includes(name.toLowerCase().split(" ")[0]) &&
      p.dest &&
      destName.toLowerCase().includes(p.dest.toLowerCase().split(" ")[0])
  );

  const gpxRoute = hasGpx ? { name: name || "Route", waypoints } : null;

  return (
    <div
      style={{
        marginBottom: "10px",
        padding: "16px 18px",
        background: "#0a0a09",
        borderRadius: "8px",
        border: "1px solid #1a1a18",
        transition: "all 0.2s",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(232,184,75,0.3)";
        e.currentTarget.style.background = "#0e0e0c";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1a1a18";
        e.currentTarget.style.background = "#0a0a09";
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "17px",
            fontWeight: "700",
            color: "#f0ede8",
          }}
        >
          {name}
        </div>
        {difficulty && (
          <span
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              flexShrink: 0,
              color: diffColor,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "3px",
              padding: "3px 8px",
            }}
          >
            {difficulty}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: "15px",
            color: "#999",
            lineHeight: 1.65,
            marginBottom: "12px",
            fontFamily: "Georgia,serif",
            margin: "0 0 12px 0",
          }}
        >
          {description}
        </p>
      )}

      {/* Stats + actions row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {dist && (
          <span
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "12px",
              color: "#e8b84b",
              background: "rgba(232,184,75,0.08)",
              padding: "3px 9px",
              borderRadius: "3px",
            }}
          >
            {dist}
          </span>
        )}
        {elevation && (
          <span
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "12px",
              color: "#9a9a94",
              background: "rgba(255,255,255,0.04)",
              padding: "3px 9px",
              borderRadius: "3px",
            }}
          >
            {elevation} gain
          </span>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
          {/* GPX download */}
          {hasGpx && (
            <button
              onClick={() => downloadGpx(gpxRoute)}
              title="Download GPX file"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                color: "#6db33f",
                textDecoration: "none",
                border: "1px solid rgba(109,179,63,0.4)",
                borderRadius: "4px",
                padding: "5px 12px",
                background: "rgba(109,179,63,0.07)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(109,179,63,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(109,179,63,0.07)";
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6db33f" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              GPX
            </button>
          )}

          {/* Strava */}
          {strava && (
            <a
              href={strava}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                color: "#fc5200",
                textDecoration: "none",
                border: "1px solid rgba(252,82,0,0.4)",
                borderRadius: "4px",
                padding: "5px 12px",
                background: "rgba(252,82,0,0.07)",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(252,82,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(252,82,0,0.07)";
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#fc5200">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
              </svg>
              Strava
            </a>
          )}

          {/* Komoot */}
          {komoot && (
            <a
              href={komoot}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                color: "#6db33f",
                textDecoration: "none",
                border: "1px solid rgba(109,179,63,0.4)",
                borderRadius: "4px",
                padding: "5px 12px",
                background: "rgba(109,179,63,0.07)",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(109,179,63,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(109,179,63,0.07)";
              }}
            >
              Komoot
            </a>
          )}

          {/* Full guide link */}
          {seoRoute && (
            <a
              href={"#route-" + seoRoute.slug}
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  window.location.href.split("#")[0] + "#route-" + seoRoute.slug,
                  "_blank"
                );
              }}
              title="Open full route guide in new window"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                color: "#C9A96E",
                textDecoration: "none",
                border: "1px solid rgba(201,169,110,0.35)",
                borderRadius: "4px",
                padding: "5px 12px",
                background: "rgba(201,169,110,0.07)",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(201,169,110,0.15)";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.6)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(201,169,110,0.07)";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.35)";
              }}
            >
              Full guide ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
