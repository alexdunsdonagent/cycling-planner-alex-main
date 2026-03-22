import React from "react";
import HotelCard from "./HotelCard";
import RouteCard from "./RouteCard";

const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Returns match quality label based on percentage */
function matchLabel(pct, { strongMatch, greatMatch, goodMatch }) {
  return pct >= 85 ? strongMatch : pct >= 70 ? greatMatch : goodMatch;
}

/** Returns CSS color for match percentage */
function matchColor(pct) {
  return pct >= 85 ? "#2D9B83" : pct >= 70 ? "#e8b84b" : "#9a9a94";
}

/** Returns match percentage integer */
function matchPercent(score) {
  if (!score || score < 0) return 0;
  return Math.round(Math.min(100, (score / 9) * 100));
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function ComparisonTable({ tops, ans, i18n, LOCATION_META, getFlightTime }) {
  const headers = [
    { label: "Country", fn: (b) => b.country },
    { label: "Terrain", fn: (b) => b.terrain },
    { label: "✈ Flight time", fn: (b) => getFlightTime(ans.from || "", b.name) || "—" },
    { label: "Difficulty", fn: (b) => b.difficulty },
    { label: "Best months", fn: (b) => (b.months || []).slice(0, 4).join(", ") },
    { label: "Road quality", fn: (b) => b.roadQuality || "—" },
    { label: "Traffic", fn: (b) => b.traffic || "—" },
    { label: "Stay zone", fn: (b) => (LOCATION_META[b.name] || {}).stayZone || "—" },
    { label: "Bike hire", fn: (b) => (LOCATION_META[b.name] || {}).bikeAnchor || "—" },
    { label: "Airport", fn: (b) => b.airport || "—" },
  ];

  return (
    <div
      style={{
        marginBottom: "28px",
        background: "#0c0c0b",
        border: "1px solid #2e2e2b",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #1a1a18",
          fontFamily: "'DM Mono','Courier New',monospace",
          fontSize: "10px",
          color: "#7a7a74",
          letterSpacing: "2px",
        }}
      >
        SIDE-BY-SIDE COMPARISON
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono','Courier New',monospace", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a1a18" }}>
              <td style={{ padding: "12px 20px", color: "#666660", width: "140px" }} />
              {tops.map((b, i) => (
                <td
                  key={i}
                  style={{ padding: "12px 20px", textAlign: "center", borderLeft: "1px solid #1a1a18" }}
                >
                  <div style={{ color: "#e8b84b", fontSize: "11px", marginBottom: "3px" }}>#{i + 1}</div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display',Georgia,serif",
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#f0ede8",
                    }}
                  >
                    {b.name}
                  </div>
                  {b.score > 0 && (
                    <div style={{ fontSize: "10px", color: "#4aaa40", marginTop: "2px" }}>
                      {matchLabel(matchPercent(b.score), i18n)}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {headers.map(({ label, fn }, ri) => (
              <tr
                key={ri}
                style={{
                  borderBottom: "1px solid #111",
                  background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}
              >
                <td
                  style={{
                    padding: "10px 20px",
                    color: "#7a7a74",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </td>
                {tops.map((b, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "10px 20px",
                      color: "#aaa",
                      textAlign: "center",
                      borderLeft: "1px solid #111",
                      fontSize: "11px",
                    }}
                  >
                    {fn(b)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── When-to-Go Calendar ─────────────────────────────────────────────────────

function WhenToGoCalendar({ b, ans }) {
  const goodMonths = b.months || [];
  const meta = LOCATION_META[b.name] || {};
  const intel = DEST_INTEL[b.name];

  return (
    <div style={{ padding: "16px 28px", background: "#090908", borderBottom: "1px solid #1a1a18" }}>
      <div
        style={{
          fontFamily: "'DM Mono','Courier New',monospace",
          fontSize: "10px",
          color: "#7a7a74",
          letterSpacing: "2px",
          marginBottom: "12px",
        }}
      >
        BEST MONTHS TO RIDE — {b.name.toUpperCase()}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12,1fr)",
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        {ALL_MONTHS.map((m) => {
          const isGood = goodMonths.includes(m);
          const isCurrent = ans.month === m;
          return (
            <div
              key={m}
              style={{
                textAlign: "center",
                padding: "8px 4px",
                borderRadius: "6px",
                background: isCurrent ? "#e8b84b" : isGood ? "rgba(74,170,64,0.15)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isCurrent ? "#e8b84b" : isGood ? "rgba(74,170,64,0.3)" : "#1a1a18"}`,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "11px",
                  color: isCurrent ? "#0a0a08" : isGood ? "#4aaa40" : "#333",
                  fontWeight: isCurrent ? "600" : "400",
                }}
              >
                {m}
              </div>
              <div style={{ fontSize: "8px", marginTop: "2px", color: isCurrent ? "#0a0a08" : isGood ? "#3a8030" : "#252520" }}>
                {isGood ? "✓" : "—"}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          fontFamily: "'DM Mono','Courier New',monospace",
          fontSize: "10px",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              background: "rgba(74,170,64,0.3)",
              border: "1px solid rgba(74,170,64,0.5)",
              borderRadius: "2px",
              display: "inline-block",
            }}
          />
          Good months
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              background: "#e8b84b",
              borderRadius: "2px",
              display: "inline-block",
            }}
          />
          Your selected month
        </span>
        {intel?.weather && <span style={{ color: "#666" }}>{intel.weather.avgTemp} avg</span>}
        {meta.months && <span style={{ color: "#7a7a74" }}>Best: {meta.months}</span>}
      </div>
    </div>
  );
}

// ─── Intel Tabs ──────────────────────────────────────────────────────────────

function IntelTabs({ intel, b, expandedIntel, setExpandedIntel, i18n, LOCATION_META, AIRPORT_INFO, ans }) {
  if (!intel) return null;

  const current = expandedIntel[b.name] || null;
  const tabs = [
    { id: "food", label: i18n.tabFood, icon: "☕", tc: "#E8944B" },
    { id: "airport", label: i18n.tabGetting, icon: "✈", tc: "#4B9BE8" },
    { id: "knowledge", label: i18n.tabKnowledge, icon: "📍", tc: "#9B7BDB" },
    { id: "warnings", label: i18n.tabWarnings, icon: "⚠", tc: "#DB7B7B" },
  ];

  return (
    <div style={{ borderBottom: "1px solid #1a1a18" }}>
      <div style={{ display: "flex", gap: "0", overflowX: "auto", padding: "0 28px" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() =>
              setExpandedIntel((p) => ({ ...p, [b.name]: p[b.name] === t.id ? null : t.id }))
            }
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "11px",
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              borderBottom: current === t.id ? `2px solid ${t.tc}` : "2px solid transparent",
              color: current === t.id ? t.tc : "#7a7a74",
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "0.5px",
              transition: "all 0.15s",
            }}
          >
            <span style={{ filter: current === t.id ? "none" : "grayscale(0.3)", transition: "filter 0.15s" }}>
              {t.icon}
            </span>{" "}
            {t.label}
          </button>
        ))}
      </div>

      {current === "food" && intel.food && (
        <div style={{ padding: "16px 28px", background: "#090908" }}>
          {(() => {
            const slots = [
              { label: "PRE-RIDE", icon: "🌅", color: "#C9A96E", text: intel.food.preRide },
              { label: "MID-RIDE", icon: "⚡", color: "#e8b84b", text: intel.food.midRide },
              { label: "POST-RIDE", icon: "🍷", color: "#2D9B83", text: intel.food.postRide },
              { label: "LOCAL FUEL", icon: "🥐", color: "#E8944B", text: intel.food.localFuel },
            ];
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {slots.map(({ label, icon, color, text }) => (
                  <div
                    key={label}
                    style={{
                      padding: "14px 16px",
                      background: "#0c0c0b",
                      borderRadius: "8px",
                      border: `1px solid rgba(${color === "#e8b84b" ? "232,184,75" : color === "#2D9B83" ? "45,155,131" : color === "#E8944B" ? "232,148,75" : "201,169,110"},0.18)`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px" }}>{icon}</span>
                      <span
                        style={{
                          fontFamily: "'DM Mono','Courier New',monospace",
                          fontSize: "10px",
                          color,
                          letterSpacing: "1.5px",
                          fontWeight: "600",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    {text && (
                      <p style={{ fontFamily: "Georgia,serif", fontSize: "13px", color: "#888", lineHeight: 1.6, margin: 0 }}>
                        {text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {current === "airport" && intel.airport && (
        <AirportTab intel={intel} b={b} LOCATION_META={LOCATION_META} AIRPORT_INFO={AIRPORT_INFO} />
      )}

      {current === "knowledge" && (
        <div style={{ padding: "16px 28px", background: "#090908" }}>
          {intel.localKnowledge && (
            <div
              style={{
                marginBottom: "12px",
                padding: "14px 16px",
                background: "#0c0c0b",
                borderRadius: "6px",
                border: "1px solid rgba(232,184,75,0.12)",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "10px",
                  color: "#e8b84b",
                  letterSpacing: "1.5px",
                  marginBottom: "8px",
                }}
              >
                LOCAL INSIDER KNOWLEDGE
              </div>
              <p style={{ fontSize: "14px", color: "#999", lineHeight: 1.75, fontFamily: "Georgia,serif", margin: 0 }}>
                {intel.localKnowledge}
              </p>
            </div>
          )}
          {intel.weather && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "8px" }}>
              {[
                ["Best months", intel.weather.months],
                ["Temperature", intel.weather.avgTemp],
                ["Rain", intel.weather.rain],
                ["Tip", intel.weather.sunriseRide],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    padding: "10px 12px",
                    background: "#0c0c0b",
                    borderRadius: "6px",
                    border: "1px solid #1a1a18",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: "10px",
                      color: "#7a7a74",
                      letterSpacing: "1px",
                      marginBottom: "4px",
                    }}
                  >
                    {k.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "13px", color: "#aaa", fontFamily: "Georgia,serif" }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {current === "warnings" && intel.warnings && (
        <div style={{ padding: "16px 28px", background: "#090908" }}>
          <div
            style={{
              padding: "14px 16px",
              background: "rgba(160,50,50,0.06)",
              borderRadius: "6px",
              border: "1px solid rgba(160,50,50,0.2)",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "10px",
                color: "#c05050",
                letterSpacing: "1.5px",
                marginBottom: "8px",
              }}
            >
              WHAT COULD GO WRONG
            </div>
            <p style={{ fontSize: "14px", color: "#999", lineHeight: 1.75, fontFamily: "Georgia,serif", margin: 0 }}>
              {intel.warnings}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Airport Tab ─────────────────────────────────────────────────────────────

function AirportTab({ intel, b, LOCATION_META, AIRPORT_INFO, ans }) {
  const airInfo =
    Object.entries(AIRPORT_INFO).find(
      ([k]) =>
        b.name.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(b.name.toLowerCase().split(" ")[0].toLowerCase())
    )?.[1] || null;
  const stayZone = (LOCATION_META[b.name] || {}).stayZone || b.name;
  const bikeAnchor = (LOCATION_META[b.name] || {}).bikeAnchor || "";

  return (
    <div style={{ padding: "16px 28px", background: "#090908", display: "flex", flexDirection: "column", gap: "12px" }}>
      {airInfo?.airports?.[0] && (
        <div>
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#4a9eff",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            PRIMARY AIRPORT
          </div>
          {(() => {
            const ap = airInfo.airports[0];
            return (
              <div
                style={{
                  background: "#0c0c0b",
                  border: "1px solid rgba(74,158,255,0.2)",
                  borderRadius: "10px",
                  padding: "16px 18px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Playfair Display',Georgia,serif",
                        fontSize: "17px",
                        fontWeight: "700",
                        color: "#f0ede8",
                        marginBottom: "2px",
                      }}
                    >
                      {ap.name}
                    </div>
                    <div style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: "11px", color: "#4a9eff" }}>
                      {ap.code}
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                  {[
                    { val: ap.distKm + "km", label: "KM FROM STAY ZONE", color: "#4a9eff", bg: "rgba(74,158,255,0.06)", border: "rgba(74,158,255,0.15)" },
                    { val: ap.transferMins + " min", label: "MIN TRANSFER", color: "#e8b84b", bg: "rgba(232,184,75,0.06)", border: "rgba(232,184,75,0.15)" },
                    { val: stayZone.split(" ")[0], label: "STAY ZONE", color: "#4aaa40", bg: "rgba(74,170,64,0.06)", border: "rgba(74,170,64,0.15)" },
                  ].map(({ val, label, color, bg, border }) => (
                    <div
                      key={label}
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        borderRadius: "8px",
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'DM Mono','Courier New',monospace",
                          fontSize: label.includes("MIN") ? "22px" : "11px",
                          fontWeight: "600",
                          color,
                          lineHeight: label.includes("MIN") ? 1 : 1.3,
                        }}
                      >
                        {val}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Mono','Courier New',monospace",
                          fontSize: "9px",
                          color: "#7a7a74",
                          marginTop: "4px",
                          letterSpacing: "1px",
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "13px", color: "#9a9a94", fontFamily: "Georgia,serif", margin: 0, lineHeight: 1.6 }}>
                  {ap.notes}
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {!airInfo && (
        <div style={{ background: "#0c0c0b", border: "1px solid rgba(74,158,255,0.15)", borderRadius: "8px", padding: "14px" }}>
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#4a9eff",
              letterSpacing: "1.5px",
              marginBottom: "6px",
            }}
          >
            PRIMARY AIRPORT
          </div>
          <p style={{ fontSize: "14px", color: "#ccc", fontFamily: "Georgia,serif", margin: 0 }}>{intel.airport.primary}</p>
        </div>
      )}

      {(airInfo?.alt?.[0] || intel.airport.secondary) && (
        <div>
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#7a7a74",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            ALTERNATIVE AIRPORT
          </div>
          {airInfo?.alt?.[0] ? (
            <div style={{ background: "#0c0c0b", border: "1px solid #1a1a18", borderRadius: "8px", padding: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                <div>
                  <span style={{ fontFamily: "Georgia,serif", fontSize: "14px", color: "#bbb", fontWeight: "600" }}>
                    {airInfo.alt[0].name}
                  </span>
                  <span style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: "10px", color: "#7a7a74", marginLeft: "8px" }}>
                    {airInfo.alt[0].code}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: "11px",
                      color: "#9a9a94",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid #222",
                      borderRadius: "4px",
                      padding: "3px 8px",
                    }}
                  >
                    {airInfo.alt[0].distKm}km
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: "11px",
                      color: "#9a9a94",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid #222",
                      borderRadius: "4px",
                      padding: "3px 8px",
                    }}
                  >
                    {airInfo.alt[0].transferMins} min
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#666", fontFamily: "Georgia,serif", margin: 0 }}>{airInfo.alt[0].notes}</p>
            </div>
          ) : (
            <div style={{ padding: "12px 14px", background: "#0c0c0b", borderRadius: "6px", border: "1px solid #1a1a18" }}>
              <p style={{ fontSize: "14px", color: "#9a9a94", fontFamily: "Georgia,serif", margin: 0 }}>{intel.airport.secondary}</p>
            </div>
          )}
        </div>
      )}

      {airInfo?.airports?.[0] && (
        <div
          style={{
            background: "rgba(232,184,75,0.04)",
            border: "1px solid rgba(232,184,75,0.12)",
            borderRadius: "8px",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#e8b84b",
              letterSpacing: "1.5px",
              marginBottom: "6px",
            }}
          >
            HOTEL ZONE → AIRPORT
          </div>
          <p style={{ fontSize: "13px", color: "#9a9a94", fontFamily: "Georgia,serif", margin: 0, lineHeight: 1.6 }}>
            Stay zone <strong style={{ color: "#bbb" }}>{stayZone}</strong> is approx{" "}
            <strong style={{ color: "#e8b84b" }}>{airInfo.airports[0].distKm}km / {airInfo.airports[0].transferMins} min</strong>{" "}
            from {airInfo.airports[0].code}. Allow extra time on race/event days and during peak summer when resort traffic is heavy.
          </p>
        </div>
      )}

      <div
        style={{
          padding: "12px 14px",
          background: "#0c0c0b",
          borderRadius: "6px",
          border: "1px solid rgba(74,170,64,0.12)",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "10px",
            color: "#4aaa40",
            letterSpacing: "1.5px",
            marginBottom: "5px",
          }}
        >
          BIKE TRANSPORT
        </div>
        <p style={{ fontSize: "13px", color: "#9a9a94", fontFamily: "Georgia,serif", margin: "0 0 6px 0" }}>{intel.airport.bikeNote}</p>
        {bikeAnchor && (
          <p style={{ fontSize: "12px", color: "#7a7a74", fontFamily: "'DM Mono','Courier New',monospace", margin: 0 }}>
            Local hire: {bikeAnchor}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <a
          href={`https://www.skyscanner.net/transport/flights/${(ans.from || "").substring(0, 3).toLowerCase()}/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "11px",
            color: "#4a9eff",
            textDecoration: "none",
            border: "1px solid rgba(74,158,255,0.3)",
            borderRadius: "5px",
            padding: "8px 16px",
            background: "rgba(74,158,255,0.08)",
          }}
        >
          Skyscanner ↗
        </a>
        <a
          href="https://www.google.com/flights"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "11px",
            color: "#9a9a94",
            textDecoration: "none",
            border: "1px solid #222",
            borderRadius: "5px",
            padding: "8px 16px",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          Google Flights ↗
        </a>
      </div>
    </div>
  );
}

// ─── Destination Card ─────────────────────────────────────────────────────────

function DestinationCard({
  b,
  idx,
  ans,
  routeData,
  logDest,
  routeLinks,
  hotels,
  bikeShops,
  r,
  compareMode,
  whyNotIdx,
  setWhyNotIdx,
  showWhenToGo,
  setShowWhenToGo,
  savedDests,
  toggleSaveDest,
  expandedIntel,
  setExpandedIntel,
  i18n,
  showToast,
  useMetric,
  fmtDist,
  LOCATION_META,
  DEST_INTEL,
  AIRPORT_INFO,
  ROUTE_LINKS,
  ROUTE_SEO_PAGES,
  DEST_PAGES,
  renderMap,
}) {
  const pct = matchPercent(b.score);
  const intel = DEST_INTEL[b.name];
  const destSlug = DEST_PAGES.find(
    (d) => d.title && d.title.toLowerCase().includes(b.name.toLowerCase().split(" ")[0])
  );
  const routeSlugs = ROUTE_SEO_PAGES.filter(
    (r) => r.dest && b.name.toLowerCase().includes(r.dest.toLowerCase().split(" ")[0])
  );
  const isSaved = savedDests.find((d) => d.name === b.name);

  // Build match reasons
  const reasons = [];
  if (ans.terrain && b.terrain) reasons.push(`${b.terrain} terrain matches`);
  if (ans.month && (b.months || []).includes(ans.month)) reasons.push(`${ans.month} is peak season`);
  if (ans.ability && b.difficulty) reasons.push(`${b.difficulty} suits ${ans.ability} riders`);
  if (b.roadQuality === "Excellent") reasons.push("Excellent road quality");
  if (b.traffic === "Low") reasons.push("Low traffic");
  if (b.loop && (ans.priorities || []).includes("loop")) reasons.push("Loop routes available");

  const jetlag = getJetlagWarning(b.continent, ans.from || "");
  const showJetlag = jetlag && ["Asia", "Oceania", "North America", "South America"].includes(b.continent);

  return (
    <div
      className="dest-card"
      style={{
        background: "#141413",
        border: "1px solid #2e2e2b",
        borderRadius: "14px",
        marginBottom: "28px",
        overflow: "hidden",
      }}
    >
      {/* ── Compact header ── */}
      <div
        style={{
          padding: "22px 28px",
          borderBottom: "1px solid #2e2e2b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Rank badge */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <span
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "28px",
                color: "#e8b84b",
                fontWeight: "700",
                lineHeight: 1,
                display: "block",
              }}
            >
              #{idx + 1}
            </span>
            {b.score > 0 && (
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "10px",
                  color: matchColor(pct),
                  marginTop: "2px",
                  whiteSpace: "nowrap",
                }}
              >
                {matchLabel(pct, i18n)}
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display',Georgia,serif",
                  fontSize: "26px",
                  fontWeight: "900",
                  color: "#f5f2ec",
                  letterSpacing: "-0.3px",
                  margin: 0,
                }}
              >
                {b.name}
              </h2>
              {destSlug && (
                <a
                  href={"#dest-" + destSlug.slug}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(window.location.href.split("#")[0] + "#dest-" + destSlug.slug, "_blank");
                  }}
                  title={"Open " + b.name + " destination guide in new window"}
                  style={{
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: "10px",
                    color: "#C9A96E",
                    textDecoration: "none",
                    letterSpacing: "1px",
                    opacity: 0.7,
                    transition: "opacity 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}
                >
                  Destination guide ↗
                </a>
              )}
            </div>

            <div
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "12px",
                color: "#666",
                marginTop: "3px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <span>
                {b.region} &mdash; {b.country}
              </span>
              {getFlightTime(ans.from || "", b.name) && (
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#4B9BE8", fontSize: "11px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  {getFlightTime(ans.from || "", b.name)}
                </span>
              )}
              {(LOCATION_META[b.name] || {}).bikeAnchor && (
                <span style={{ color: "#4aaa40", fontSize: "10px" }}>
                  🚲 {(LOCATION_META[b.name] || {}).bikeAnchor}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          {b.tag && (
            <span
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                background: "rgba(232,184,75,0.1)",
                border: "1px solid rgba(232,184,75,0.3)",
                borderRadius: "4px",
                padding: "4px 10px",
                color: "#e8b84b",
              }}
            >
              {b.tag}
            </span>
          )}
          {[b.terrain, b.difficulty].map(
            (t) =>
              t && (
                <span
                  key={t}
                  style={{
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: "11px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid #222",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    color: "#9a9a94",
                  }}
                >
                  {t}
                </span>
              )
          )}

          {/* Not this one */}
          <button
            className="dismiss-btn"
            onClick={() => setWhyNotIdx(whyNotIdx === idx ? null : idx)}
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: whyNotIdx === idx ? "#db7b7b" : "#444",
              background: whyNotIdx === idx ? "rgba(219,123,123,0.08)" : "transparent",
              border: "1px solid " + (whyNotIdx === idx ? "rgba(219,123,123,0.3)" : "#1e1e1c"),
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              if (whyNotIdx !== idx) {
                e.currentTarget.style.color = "#db7b7b";
                e.currentTarget.style.borderColor = "rgba(219,123,123,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (whyNotIdx !== idx) {
                e.currentTarget.style.color = "#444";
                e.currentTarget.style.borderColor = "#1e1e1c";
              }
            }}
          >
            {i18n.notThisOne}
          </button>

          {/* Save */}
          <div style={{ position: "relative", display: "inline-flex" }}>
            <button
              className="save-btn"
              onClick={() => toggleSaveDest(b)}
              title={isSaved ? "Remove from saved" : "Save to your profile"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                color: isSaved ? "#e8b84b" : "#888",
                background: isSaved ? "rgba(232,184,75,0.12)" : "rgba(255,255,255,0.04)",
                border: "1px solid " + (isSaved ? "rgba(232,184,75,0.4)" : "#2a2a28"),
                borderRadius: "6px",
                padding: "6px 13px",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: isSaved ? "700" : "400",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isSaved ? "rgba(232,184,75,0.2)" : "rgba(232,184,75,0.08)";
                e.currentTarget.style.borderColor = "rgba(232,184,75,0.4)";
                e.currentTarget.style.color = "#e8b84b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isSaved ? "rgba(232,184,75,0.12)" : "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = isSaved ? "rgba(232,184,75,0.4)" : "#2a2a28";
                e.currentTarget.style.color = isSaved ? "#e8b84b" : "#888";
              }}
            >
              <span style={{ fontSize: "13px" }}>{isSaved ? "♥" : "♡"}</span>
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>

          {/* When to go */}
          <div style={{ position: "relative", display: "inline-flex" }}>
            <button
              className="calendar-btn"
              onClick={() => setShowWhenToGo(showWhenToGo === b.name ? null : b.name)}
              title={`Best months to ride ${b.name}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                color: showWhenToGo === b.name ? "#2D9B83" : "#888",
                background: showWhenToGo === b.name ? "rgba(45,155,131,0.12)" : "rgba(255,255,255,0.04)",
                border: "1px solid " + (showWhenToGo === b.name ? "rgba(45,155,131,0.4)" : "#2a2a28"),
                borderRadius: "6px",
                padding: "6px 13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(45,155,131,0.1)";
                e.currentTarget.style.borderColor = "rgba(45,155,131,0.4)";
                e.currentTarget.style.color = "#2D9B83";
              }}
              onMouseLeave={(e) => {
                if (showWhenToGo !== b.name) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "#2a2a28";
                  e.currentTarget.style.color = "#888";
                }
              }}
            >
              <span style={{ fontSize: "12px" }}>📅</span>
              {showWhenToGo === b.name ? "Close" : "Best months"}
            </button>
          </div>
        </div>
      </div>

      {/* ── When to go calendar ── */}
      {showWhenToGo === b.name && <WhenToGoCalendar b={b} ans={ans} />}

      {/* ── Why not panel ── */}
      {whyNotIdx === idx && (
        <div style={{ padding: "14px 28px", background: "rgba(219,123,123,0.04)", borderBottom: "1px solid rgba(219,123,123,0.15)" }}>
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#db7b7b",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            WHAT PUTS YOU OFF {b.name.toUpperCase()}?
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["Too far to fly", "Too expensive", "Already been", "Wrong climate", "Wrong terrain", "Too busy"].map((reason) => (
              <button
                key={reason}
                onClick={() => {
                  setWhyNotIdx(null);
                  showToast(`Got it · we'll factor "${reason}" into future matches`);
                }}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(219,123,123,0.3)",
                  borderRadius: "20px",
                  padding: "5px 14px",
                  cursor: "pointer",
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "10px",
                  color: "#db7b7b",
                  letterSpacing: "0.5px",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(219,123,123,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Match reasons + jetlag ── */}
      {(reasons.length > 0 || showJetlag) && (
        <div style={{ borderBottom: "1px solid #1a1a18" }}>
          {reasons.length > 0 && (
            <div
              style={{
                padding: "8px 28px",
                background: "rgba(74,158,255,0.03)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "10px",
                  color: "#2D9B83",
                  letterSpacing: "1px",
                  flexShrink: 0,
                }}
              >
                WHY MATCHED:
              </span>
              {reasons.map((r, ri) => (
                <span
                  key={ri}
                  style={{
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: "10px",
                    color: "#7a7a74",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid #2e2e2b",
                    borderRadius: "3px",
                    padding: "2px 8px",
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          )}
          {showJetlag && (
            <div
              style={{
                padding: "8px 28px",
                background: "rgba(255,140,66,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "14px" }}>✈️</span>
              <span
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "10px",
                  color: "#ff8c42",
                  letterSpacing: "0.5px",
                }}
              >
                JETLAG NOTE:
              </span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: "13px", color: "#666" }}>{jetlag.msg}</span>
            </div>
          )}
        </div>
      )}

      {/* ── SEO destination & route guide links ── */}
      {(destSlug || routeSlugs.length > 0) && (
        <div
          style={{
            padding: "10px 28px",
            background: "rgba(201,169,110,0.04)",
            borderBottom: "1px solid rgba(201,169,110,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "9px",
              color: "#555",
              letterSpacing: "2px",
              flexShrink: 0,
            }}
          >
            FULL GUIDES ↗
          </span>
          {destSlug && (
            <button
              onClick={() => {
                /* handled via parent callback - open dest page */
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "transparent",
                border: "1px solid rgba(201,169,110,0.3)",
                borderRadius: "4px",
                padding: "5px 12px",
                cursor: "pointer",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "10px",
                color: "#C9A96E",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,169,110,0.1)";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
              }}
            >
              📍 {b.name} destination →
            </button>
          )}
          {routeSlugs.slice(0, 3).map((r) => (
            <button
              key={r.slug}
              onClick={() => {
                /* handled via parent callback */
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "transparent",
                border: "1px solid rgba(74,155,232,0.2)",
                borderRadius: "4px",
                padding: "5px 12px",
                cursor: "pointer",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "10px",
                color: "#4B9BE8",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(74,155,232,0.08)";
                e.currentTarget.style.borderColor = "rgba(74,155,232,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(74,155,232,0.2)";
              }}
            >
              🚴 {r.title.split("—")[0].trim()} →
            </button>
          ))}
        </div>
      )}

      {/* ── Intel tabs ── */}
      <IntelTabs
        intel={intel}
        b={b}
        expandedIntel={expandedIntel}
        setExpandedIntel={setExpandedIntel}
        i18n={i18n}
        LOCATION_META={LOCATION_META}
        AIRPORT_INFO={AIRPORT_INFO}
        ans={ans}
      />

      {/* ── Content grid ── */}
      <div
        className="results-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #2e2e2b" }}
      >
        {/* LEFT: Overview + Routes */}
        <div style={{ padding: "24px 28px", borderRight: "1px solid #2e2e2b" }}>
          {routeLinks?.overview && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  color: "#e8b84b",
                  marginBottom: "10px",
                }}
              >
                ABOUT THIS DESTINATION
              </div>
              <p style={{ fontSize: "16px", color: "#aaa", lineHeight: 1.75, fontFamily: "Georgia,serif", margin: 0 }}>
                {routeLinks.overview}
              </p>
            </div>
          )}

          {routeLinks?.articles?.length > 0 && (
            <div
              style={{
                marginBottom: "22px",
                padding: "14px 16px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "8px",
                border: "1px solid #1a1a18",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  color: "#7a7a74",
                  marginBottom: "10px",
                }}
              >
                FURTHER READING
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {routeLinks.articles.map((a, ai) => (
                  <a
                    key={ai}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      textDecoration: "none",
                      color: "#bbb",
                      fontSize: "14px",
                      fontFamily: "Georgia,serif",
                      lineHeight: 1.4,
                      transition: "color 0.15s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#e8b84b")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#bbb")}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#555"
                      strokeWidth="2"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {a.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "11px",
              letterSpacing: "3px",
              color: "#e8b84b",
              marginBottom: "14px",
            }}
          >
            ROUTES & RIDING
          </div>

          {/* Strava / Komoot explore buttons */}
          {routeLinks && (routeLinks.stravaExplore || routeLinks.komootCollection) && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              {routeLinks.stravaExplore && (
                <a
                  href={routeLinks.stravaExplore}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: "13px",
                    color: "#fc5200",
                    textDecoration: "none",
                    background: "rgba(252,82,0,0.1)",
                    border: "1px solid rgba(252,82,0,0.35)",
                    borderRadius: "6px",
                    padding: "10px 18px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    transition: "all 0.15s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(252,82,0,0.18)";
                    e.currentTarget.style.borderColor = "rgba(252,82,0,0.6)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(252,82,0,0.1)";
                    e.currentTarget.style.borderColor = "rgba(252,82,0,0.35)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fc5200">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                  Explore on Strava
                </a>
              )}
              {routeLinks.komootCollection && (
                <a
                  href={routeLinks.komootCollection}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: "13px",
                    color: "#6db33f",
                    textDecoration: "none",
                    background: "rgba(109,179,63,0.1)",
                    border: "1px solid rgba(109,179,63,0.35)",
                    borderRadius: "6px",
                    padding: "10px 18px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    transition: "all 0.15s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(109,179,63,0.18)";
                    e.currentTarget.style.borderColor = "rgba(109,179,63,0.6)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(109,179,63,0.1)";
                    e.currentTarget.style.borderColor = "rgba(109,179,63,0.35)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#6db33f">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8l4 4-4 4-4-4 4-4z" fill="#1a1a18" />
                  </svg>
                  Browse on Komoot
                </a>
              )}
            </div>
          )}

          {/* AI-generated routes (from routeResult) */}
          {routeData?.routes?.map((route, ri) => (
            <RouteCard
              key={ri}
              route={route}
              destName={b.name}
              seoRoutes={ROUTE_SEO_PAGES}
              style={{ marginBottom: "10px" }}
            />
          ))}

          {/* Stored routes from ROUTE_LINKS */}
          {routeLinks?.routes?.map((route, ri) => (
            <RouteCard
              key={ri}
              route={route}
              destName={b.name}
              seoRoutes={ROUTE_SEO_PAGES}
              style={{ marginBottom: "10px" }}
            />
          ))}

          {/* Map */}
          {renderMap && (
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  color: "#7a7a74",
                  marginBottom: "8px",
                }}
              >
                ROUTE MAP
              </div>
              {renderMap({ destName: b.name, destLat: logDest?.lat || null, destLng: logDest?.lng || null,
                hotels: hotels.filter((h) => h.lat && h.lng),
                bikeShops: bikeShops.filter((s) => s.lat && s.lng),
                routes: routeData?.routes || [] })}
            </div>
          )}

          {/* Stay zone */}
          {routeData?.stayZone && (
            <div
              style={{
                marginTop: "14px",
                padding: "12px 16px",
                background: "rgba(232,184,75,0.05)",
                border: "1px solid rgba(232,184,75,0.15)",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "11px",
                  color: "#e8b84b",
                  marginBottom: "4px",
                  letterSpacing: "2px",
                }}
              >
                BEST AREA TO STAY
              </div>
              <div style={{ fontSize: "15px", color: "#ccc", fontFamily: "Georgia,serif" }}>{routeData.stayZone}</div>
            </div>
          )}

          {/* Daily plan */}
          {r?.days && (
            <div style={{ marginTop: "14px" }}>
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  color: "#666660",
                  marginBottom: "8px",
                }}
              >
                YOUR DAILY PLAN
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {r.days.map((d) => (
                  <div
                    key={d.day}
                    style={{
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: "11px",
                      color: "#7a7a74",
                      background: "#0a0a09",
                      border: "1px solid #1a1a18",
                      borderRadius: "4px",
                      padding: "3px 8px",
                    }}
                  >
                    D{d.day}: {fmtDist(d.km, useMetric)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Hotels */}
        <div style={{ padding: "24px 28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#e8b84b",
              }}
            >
              WHERE TO STAY
            </div>
            <div style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: "10px", color: "#666660" }}>
              prices approx &middot; verify before booking
            </div>
          </div>

          {/* Hotel list */}
          {hotels.length > 0 ? (
            <div>
              {hotels.slice(0, 8).map((h, hi) => (
                <HotelCard key={hi} hotel={h} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#7a7a74",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  border: "1px solid #4aaa40",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  willChange: "transform",
                }}
              />
              Searching hotels...
            </div>
          )}

          {/* Bike shops */}
          {bikeShops.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  color: "#e8b84b",
                  marginBottom: "12px",
                }}
              >
                BIKE SHOPS & HIRE
              </div>
              {bikeShops.map((s, si) => (
                <div
                  key={si}
                  style={{
                    marginBottom: "8px",
                    padding: "12px 14px",
                    background: "#0a0a09",
                    borderRadius: "8px",
                    border: "1px solid #1a1a18",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display',Georgia,serif",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#ccc",
                      marginBottom: "3px",
                    }}
                  >
                    {s.name}
                  </div>
                  {s.address && (
                    <div
                      style={{
                        fontFamily: "'DM Mono','Courier New',monospace",
                        fontSize: "11px",
                        color: "#666660",
                        marginBottom: "3px",
                      }}
                    >
                      {s.address}
                    </div>
                  )}
                  {s.services && (
                    <div style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: "11px", color: "#4aaa40" }}>
                      {s.services}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── QuizResults ─────────────────────────────────────────────────────────────

/**
 * Full results screen component.
 *
 * Props:
 *   tops           — top 3 destination objects
 *   ans            — user answers object
 *   routes         — array of route data for each destination (from AI)
 *   routeResult    — raw JSON string from AI route generation
 *   logisticsData  — logistics data object
 *   logisticsLoading — boolean
 *   compareMode    — boolean
 *   setCompareMode — setter
 *   whyNotIdx      — number | null
 *   setWhyNotIdx   — setter
 *   showWhenToGo   — string | null (destination name)
 *   setShowWhenToGo — setter
 *   savedDests     — array of saved destinations
 *   toggleSaveDest  — function(destination)
 *   expandedIntel   — object { [destName]: tabId | null }
 *   setExpandedIntel — setter
 *   i18n           — translations object
 *   adjustPrefs    — function (navigate back to quiz)
 *   showToast      — function(message)
 *   fmtDist        — function(km, useMetric): string
 *   useMetric      — boolean
 *   LOCATION_META  — location metadata object
 *   DEST_INTEL     — destination intel object
 *   AIRPORT_INFO   — airport info object
 *   ROUTE_LINKS    — route links object
 *   ROUTE_SEO_PAGES — array of SEO page entries
 *   DEST_PAGES     — array of destination page entries
 *   getFlightTime  — function(fromCity, destName): string
 *   getJetlagWarning — function(continent, fromCity): {msg} | null
 *   renderMap      — function(props): ReactNode — renders LeafletMap
 */
export default function QuizResults({
  tops,
  ans,
  routes,
  routeResult,
  logisticsData,
  logisticsLoading,
  compareMode,
  setCompareMode,
  whyNotIdx,
  setWhyNotIdx,
  showWhenToGo,
  setShowWhenToGo,
  savedDests,
  toggleSaveDest,
  expandedIntel,
  setExpandedIntel,
  i18n,
  adjustPrefs,
  showToast,
  fmtDist,
  useMetric,
  LOCATION_META: LOCATION_META_INNER,
  DEST_INTEL: DEST_INTEL_INNER,
  AIRPORT_INFO: AIRPORT_INFO_INNER,
  ROUTE_LINKS,
  ROUTE_SEO_PAGES,
  DEST_PAGES,
  getFlightTime,
  getJetlagWarning,
  renderMap,
}) {
  // Parse route data for each destination
  const getRouteData = (idx) => {
    try {
      const p = JSON.parse(routeResult || "{}");
      return (p.destinations || [])[idx] || null;
    } catch (e) {
      return null;
    }
  };

  // Determine if casual/beginner + challenge = show warning
  const showCasualChallengeWarning =
    (ans.ability === "casual" || ans.ability === "beginner") &&
    (ans.priorities || []).includes("challenge");

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#080807" }}>
      <div style={{ padding: "32px 40px", background: "linear-gradient(180deg,#100e09 0%,#080807 120px)" }}>
        {/* Results intro bar */}
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "22px",
                fontWeight: "700",
                color: "#f0ede8",
                margin: "0 0 6px 0",
              }}
            >
              {i18n.topMatches}
            </h2>
            <div style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: "12px", color: "#7a7a74" }}>
              {ans.ability && <span>{ans.ability} cyclist &middot; </span>}
              {ans.month && <span>{ans.month} &middot; </span>}
              {ans.days && <span>{ans.days} days &middot; </span>}
              {ans.terrain && <span>{ans.terrain} riding &middot; </span>}
              from {ans.from || "your location"}
            </div>
            {showCasualChallengeWarning && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 14px",
                  background: "rgba(232,184,75,0.06)",
                  border: "1px solid rgba(232,184,75,0.2)",
                  borderRadius: "6px",
                  fontFamily: "Georgia,serif",
                  fontSize: "14px",
                  color: "#b8943b",
                  maxWidth: "520px",
                }}
              >
                💡 You picked casual fitness but want challenging routes. We&rsquo;ve matched destinations where easier and harder
                routes share the same base — push yourself on good days, take it easy on others.
              </div>
            )}
          </div>

          {/* Compare + Adjust buttons */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {tops.length >= 2 && (
              <button
                onClick={() => setCompareMode((m) => !m)}
                style={{
                  background: compareMode ? "rgba(232,184,75,0.12)" : "transparent",
                  border: "1px solid " + (compareMode ? "rgba(232,184,75,0.4)" : "#252523"),
                  borderRadius: "6px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "11px",
                  color: compareMode ? "#e8b84b" : "#555",
                  letterSpacing: "1px",
                  transition: "all 0.15s",
                }}
              >
                {compareMode ? "✕ Close" : i18n.compareAll}
              </button>
            )}
            <button
              onClick={adjustPrefs}
              style={{
                background: "rgba(232,184,75,0.06)",
                border: "1px solid rgba(232,184,75,0.2)",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "11px",
                color: "#b8943b",
                letterSpacing: "1px",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(232,184,75,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(232,184,75,0.06)")}
            >
              {i18n.adjustPrefs}
            </button>
          </div>
        </div>

        {/* Comparison table */}
        {compareMode && tops.length > 0 && (
          <ComparisonTable
            tops={tops}
            ans={ans}
            i18n={i18n}
            LOCATION_META={LOCATION_META_INNER}
            getFlightTime={getFlightTime}
          />
        )}

        {/* Destination cards */}
        {tops.map((b, idx) => {
          const routeData = getRouteData(idx);
          const logDest = (logisticsData?.destinations || [])[idx];
          const routeLinks =
            Object.entries(ROUTE_LINKS).find(([k]) =>
              b.name.toLowerCase().includes(k.toLowerCase())
            )?.[1] || null;
          const hotels = logDest?.hotels || [];
          const bikeShops = logDest?.bikeShops || [];
          const r = routes[idx];

          return (
            <DestinationCard
              key={idx}
              b={b}
              idx={idx}
              ans={ans}
              routeData={routeData}
              logDest={logDest}
              routeLinks={routeLinks}
              hotels={hotels}
              bikeShops={bikeShops}
              r={r}
              compareMode={compareMode}
              whyNotIdx={whyNotIdx}
              setWhyNotIdx={setWhyNotIdx}
              showWhenToGo={showWhenToGo}
              setShowWhenToGo={setShowWhenToGo}
              savedDests={savedDests}
              toggleSaveDest={toggleSaveDest}
              expandedIntel={expandedIntel}
              setExpandedIntel={setExpandedIntel}
              i18n={i18n}
              showToast={showToast}
              useMetric={useMetric}
              fmtDist={fmtDist}
              LOCATION_META={LOCATION_META_INNER}
              DEST_INTEL={DEST_INTEL_INNER}
              AIRPORT_INFO={AIRPORT_INFO_INNER}
              ROUTE_LINKS={ROUTE_LINKS}
              ROUTE_SEO_PAGES={ROUTE_SEO_PAGES}
              DEST_PAGES={DEST_PAGES}
              getFlightTime={getFlightTime}
              getJetlagWarning={getJetlagWarning}
              renderMap={renderMap}
            />
          );
        })}
      </div>
    </div>
  );
}
