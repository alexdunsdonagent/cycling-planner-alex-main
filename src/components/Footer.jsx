import React from "react";

export default function Footer({
  phase,
  DEST_PAGES,
  ROUTE_SEO_PAGES,
  BASES,
  i18n,
  setDestPage,
  setRoutePage,
  openDynRoute,
  setShowPrivacy,
  setShowTerms,
  setShowAbout,
}) {
  return (
    <footer
      style={{
        borderTop: "1px solid #1e1e1c",
        background: "#070706",
        display:
          phase === "q" || phase === "scoring" || phase === "results"
            ? "none"
            : "block",
      }}
    >
      {/* ── DESTINATIONS — prominent, above fold ── */}
      <div
        style={{
          padding: "40px 40px 28px",
          borderBottom: "1px solid #141412",
          background: "linear-gradient(180deg,#0c0b09 0%,#070706 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "14px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "20px",
              fontWeight: "700",
              color: "#f0ede8",
              letterSpacing: "-0.3px",
            }}
          >
            Cycling Destinations
          </div>
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#7a7a74",
              letterSpacing: "1px",
            }}
          >
            hotels · routes · local intel
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "10px",
          }}
        >
          {DEST_PAGES.map((d) => (
            <button
              key={d.slug}
              onMouseDown={() => {
                setDestPage(d.slug);
                setRoutePage(null);
                window.scrollTo(0, 0);
              }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid #242422",
                borderRadius: "8px",
                textAlign: "left",
                cursor: "pointer",
                padding: "13px 15px",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(232,184,75,0.35)";
                e.currentTarget.style.background = "rgba(232,184,75,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#242422";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display',Georgia,serif",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#ddd",
                  marginBottom: "4px",
                  lineHeight: 1.2,
                }}
              >
                {d.title}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "9px",
                  color: "#C9A96E",
                  letterSpacing: "0.5px",
                }}
              >
                {d.stats[0].v}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Named Routes — flat inline grid ── */}
      <div
        style={{ padding: "20px 40px 24px", borderTop: "1px solid #0e0e0c" }}
      >
        <div
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "9px",
            color: "#333",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          NAMED ROUTES — {ROUTE_SEO_PAGES.length} OUT-AND-BACK GUIDES
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "2px 16px",
          }}
        >
          {ROUTE_SEO_PAGES.map((r) => (
            <button
              key={r.slug}
              onMouseDown={() => {
                if (r.slug) setRoutePage(r.slug);
                else if (r.name) openDynRoute(r.dest || "", r);
                window.scrollTo(0, 0);
              }}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                padding: "4px 0",
                display: "flex",
                alignItems: "baseline",
                gap: "6px",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "11px",
                  color: "#3a3a38",
                  transition: "color 0.15s",
                  flex: 1,
                  lineHeight: 1.3,
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#aaa";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#3a3a38";
                }}
              >
                {r.title.split("—")[0].trim()}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "8px",
                  color: "#272725",
                  flexShrink: 0,
                }}
              >
                {r.dest}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom bar — copyright + links ── */}
      <div
        style={{
          padding: "14px 40px",
          borderTop: "1px solid #0e0e0c",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "10px",
            color: "#2a2a28",
            letterSpacing: "1px",
          }}
        >
          &copy; {new Date().getFullYear()} CYCLING TRIP PLANNER
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { label: i18n.contact, href: "mailto:hello@cyclingplanner.cc" },
            { label: i18n.privacyPolicy, fn: () => setShowPrivacy(true) },
            { label: i18n.termsUse, fn: () => setShowTerms(true) },
            { label: i18n.about, fn: () => setShowAbout(true) },
          ].map(({ label, href, fn }) => (
            <a
              key={label}
              href={href || "#"}
              onClick={
                fn
                  ? (e) => {
                      e.preventDefault();
                      fn();
                    }
                  : undefined
              }
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "10px",
                color: "#444",
                letterSpacing: "1px",
                textDecoration: "none",
              }}
              onMouseOver={(e) => (e.target.style.color = "#e8b84b")}
              onMouseOut={(e) => (e.target.style.color = "#444")}
            >
              {label}
            </a>
          ))}
        </div>
        <div
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "10px",
            color: "#2a2a28",
          }}
        >
          {BASES.length} DESTINATIONS · {ROUTE_SEO_PAGES.length} ROUTES
        </div>
      </div>
    </footer>
  );
}
