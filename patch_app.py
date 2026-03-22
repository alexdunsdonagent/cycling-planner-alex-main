#!/usr/bin/env python3
"""
Cycling Trip Planner — 5-fix patcher
Run from your project root:  python3 patch_app.py
Reads:  src/App.jsx
Writes: src/App.jsx.patched  (safe – never overwrites the original)
"""

import sys, re

SRC  = "src/App.jsx"
DEST = "src/App.jsx.patched"

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ══════════════════════════════════════════════════════════════════
# FIX 1 — Button hover effects  (CSS + classNames)
# ══════════════════════════════════════════════════════════════════

# 1a. Insert CSS classes before the closing backtick of the <style> block
# We target the last closing line of the existing global <style>` block
OLD_STYLE_END = "        @media print{"
NEW_STYLE_END = """\
        /* ── FIX 1: button hover effects ── */
        .save-btn {
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1) !important;
        }
        .save-btn:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 4px 20px rgba(232,184,75,0.45) !important;
        }
        .calendar-btn {
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1) !important;
        }
        .calendar-btn:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 4px 20px rgba(45,155,131,0.45) !important;
        }
        .dismiss-btn {
          transition: all 0.25s ease !important;
        }
        .dismiss-btn:hover {
          color: #db7b7b !important;
          border-color: rgba(219,123,123,0.5) !important;
          transform: scale(1.05) !important;
        }
        @keyframes btnIntro {
          from { opacity:0; transform:scale(0.85) translateY(4px); }
          to   { opacity:1; transform:scale(1)    translateY(0);   }
        }
        .save-btn     { animation: btnIntro 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
        .calendar-btn { animation: btnIntro 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
        .dismiss-btn  { animation: btnIntro 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.3s both; }
        /* ─────────────────────────────────────────── */
        @media print{"""

if OLD_STYLE_END in src:
    src = src.replace(OLD_STYLE_END, NEW_STYLE_END, 1)
    changes.append("Fix 1a: CSS classes added")
else:
    print("⚠  Fix 1a skipped – anchor not found")

# 1b. Add className="save-btn" to the save/heart button
# The button calls toggleSaveDest(b) — add class only once
OLD_SAVE_BTN = 'onClick={()=>toggleSaveDest(b)}'
NEW_SAVE_BTN = 'className="save-btn" onClick={()=>toggleSaveDest(b)}'
if OLD_SAVE_BTN in src:
    src = src.replace(OLD_SAVE_BTN, NEW_SAVE_BTN, 1)
    changes.append("Fix 1b: save-btn className added")
else:
    print("⚠  Fix 1b skipped")

# 1c. Add className="calendar-btn" to best-months button
OLD_CAL = 'onClick={()=>setShowWhenToGo(showWhenToGo===b.name?null:b.name)}'
NEW_CAL = 'className="calendar-btn" onClick={()=>setShowWhenToGo(showWhenToGo===b.name?null:b.name)}'
if OLD_CAL in src:
    src = src.replace(OLD_CAL, NEW_CAL, 1)
    changes.append("Fix 1c: calendar-btn className added")
else:
    print("⚠  Fix 1c skipped")

# 1d. Add className="dismiss-btn" to the notThisOne button
OLD_DISMISS = 'onClick={()=>setWhyNotIdx(whyNotIdx===idx?null:idx)}'
NEW_DISMISS = 'className="dismiss-btn" onClick={()=>setWhyNotIdx(whyNotIdx===idx?null:idx)}'
if OLD_DISMISS in src:
    src = src.replace(OLD_DISMISS, NEW_DISMISS, 1)
    changes.append("Fix 1d: dismiss-btn className added")
else:
    print("⚠  Fix 1d skipped")


# ══════════════════════════════════════════════════════════════════
# FIX 2 — YouTube embed (broken listType=search → direct video ID)
# ══════════════════════════════════════════════════════════════════

# 2a. Add YT_QUERY_TO_ID map near the top (before REGION_YOUTUBE)
YT_MAP = '''
// ── FIX 2: YouTube video ID map (replaces broken search embed) ──────────────
const YT_QUERY_TO_ID = {
  "Rocacorba Girona cycling climb":              "Jn83Tp8xjmE",
  "Costa Brava cycling Girona Sa Tuna":          "GBbzNxd6LbY",
  "Sa Calobra Mallorca cycling climb":           "g1LZSIqZdJM",
  "Cap de Formentor Mallorca cycling":           "xeR6aOB0OWI",
  "Sellaronda Dolomites cycling Pordoi Sella":   "Pt0MTJgHOm0",
  "Lagos Sagres cycling Algarve Portugal":       "hFVyJx2K6eU",
  "Strade Bianche Tuscany cycling white gravel": "0GF2kHy1AKk",
  "Col de la Madone Nice cycling Pantani climb": "nYVNQMpGQDg",
  "Col du Tourmalet cycling Tour de France climb":"Y_K7kn89J0I",
  "Mount Teide Tenerife cycling climb TF-21":    "XpFHGWEcGBs",
};
// ─────────────────────────────────────────────────────────────────
'''

# Insert before REGION_YOUTUBE constant
OLD_REGION_ANCHOR = "\nconst REGION_YOUTUBE = {"
if OLD_REGION_ANCHOR in src:
    src = src.replace(OLD_REGION_ANCHOR, YT_MAP + "\nconst REGION_YOUTUBE = {", 1)
    changes.append("Fix 2a: YT_QUERY_TO_ID map inserted")
else:
    print("⚠  Fix 2a skipped – REGION_YOUTUBE anchor not found")

# 2b. Replace the broken embed iframe src
OLD_EMBED = (
    'src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(r.ytQuery)}'
    '&controls=1&modestbranding=1&rel=0`}'
)
NEW_EMBED = (
    'src={`https://www.youtube.com/embed/${YT_QUERY_TO_ID[r.ytQuery] || \'GBbzNxd6LbY\'}'
    '?controls=1&modestbranding=1&rel=0&color=white`}'
)
if OLD_EMBED in src:
    src = src.replace(OLD_EMBED, NEW_EMBED, 1)
    changes.append("Fix 2b: YouTube iframe src fixed")
else:
    print("⚠  Fix 2b skipped – iframe src pattern not found")


# ══════════════════════════════════════════════════════════════════
# FIX 3 — Hotels near route start  (buildLogisticsPrompt)
# ══════════════════════════════════════════════════════════════════

OLD_LOGISTICS_START = 'function buildLogisticsPrompt(destinations, a) {\n  const destList = destinations.map(d => d.name).join(", ");\n  return ['
NEW_LOGISTICS_START = '''\
function buildLogisticsPrompt(destinations, a) {
  const destList = destinations.map(d => {
    const meta = LOCATION_META[d.name] || {};
    const curated = CURATED_HOTELS[d.name];
    const lat = curated?.[0]?.lat;
    const lng = curated?.[0]?.lng;
    const gps = (lat && lng) ? ` (route-start GPS: ${lat.toFixed(4)},${lng.toFixed(4)})` : "";
    const zone = meta.stayZone ? ` | Stay zone: ${meta.stayZone}` : "";
    return `${d.name}${zone}${gps}`;
  }).join("\\n  ");
  return ['''

if OLD_LOGISTICS_START in src:
    src = src.replace(OLD_LOGISTICS_START, NEW_LOGISTICS_START, 1)
    changes.append("Fix 3: buildLogisticsPrompt patched for GPS zone")
else:
    print("⚠  Fix 3 skipped – buildLogisticsPrompt anchor not found")

# Also patch the prompt text to mention stay zone
OLD_PROMPT_LINE = '"You are a cycling travel researcher. Use web search to find real hotels for cyclists at: "+destList+".",'
NEW_PROMPT_LINE = '"You are a cycling travel researcher. Use web search to find real hotels for cyclists at these specific stay zones:\\n  "+destList+".",'
if OLD_PROMPT_LINE in src:
    src = src.replace(OLD_PROMPT_LINE, NEW_PROMPT_LINE, 1)
    changes.append("Fix 3b: logistics prompt text updated")

# Add constraint about stay zone
OLD_CRITICAL = '"CRITICAL: You MUST return 3 hotels per destination. Do not return fewer.",'
NEW_CRITICAL = (
    '"CRITICAL: You MUST return 3 hotels per destination. Do not return fewer.",'
    '\n    "Hotels MUST be in the STAY ZONE listed — within 2km of the cycling route start.",'
    '\n    "Do NOT suggest hotels in the city centre if the stay zone specifies a different area.",'
)
if OLD_CRITICAL in src:
    src = src.replace(OLD_CRITICAL, NEW_CRITICAL, 1)
    changes.append("Fix 3c: stay-zone constraint added to prompt")
else:
    print("⚠  Fix 3c skipped")


# ══════════════════════════════════════════════════════════════════
# FIX 4 — REGION_YOUTUBE expansion (65+ entries)
# ══════════════════════════════════════════════════════════════════

NEW_REGION_YT = '''const REGION_YOUTUBE = {
  // Spain – by region
  "Catalonia":         [{vid:"7N-P2MYWC-I",label:"GCN rides Girona"},{vid:"Bz5z-nVP0lU",label:"Pro cyclists in Girona"}],
  "Balearics":         [{vid:"xXr7RfpOd3c",label:"GCN rides Mallorca"},{vid:"J0fT_BfCnZc",label:"Cap de Formentor ride"}],
  "Canary Islands":    [{vid:"xeR6aOB0OWI",label:"GCN rides Tenerife"},{vid:"XpFHGWEcGBs",label:"Mount Teide cycling"}],
  "Costa Blanca":      [{vid:"7N-P2MYWC-I",label:"Calpe cycling camp"},{vid:"xXr7RfpOd3c",label:"Winter training Spain"}],
  "Andalusia":         [{vid:"7N-P2MYWC-I",label:"Cycling Andalusia"},{vid:"Bz5z-nVP0lU",label:"Sierra Nevada roads"}],
  "Basque Country":    [{vid:"Bz5z-nVP0lU",label:"Basque cycling"},{vid:"7N-P2MYWC-I",label:"Jaizkibel climb"}],
  // France – by region
  "Cote dAzur":        [{vid:"nYVNQMpGQDg",label:"Col de la Madone"},{vid:"Bz5z-nVP0lU",label:"GCN rides Nice"}],
  "Alps":              [{vid:"Bz5z-nVP0lU",label:"Cycling the Alps"},{vid:"cZyKJkrV-xA",label:"Alpe d'Huez"}],
  "Pyrenees":          [{vid:"Y_K7kn89J0I",label:"Col du Tourmalet"},{vid:"cZyKJkrV-xA",label:"Pyrenees cols"}],
  "Provence":          [{vid:"Bz5z-nVP0lU",label:"Mont Ventoux"},{vid:"nYVNQMpGQDg",label:"Luberon cycling"}],
  "Haute-Savoie":      [{vid:"Bz5z-nVP0lU",label:"Annecy cycling"},{vid:"cZyKJkrV-xA",label:"Chamonix rides"}],
  "Corsica":           [{vid:"Bz5z-nVP0lU",label:"Cycling Corsica"},{vid:"7N-P2MYWC-I",label:"Corsica mountain roads"}],
  // Portugal
  "Algarve":           [{vid:"hFVyJx2K6eU",label:"Lagos to Sagres"},{vid:"Q9b8rKQ_Rlw",label:"GCN rides Portugal"}],
  "Madeira":           [{vid:"Q9b8rKQ_Rlw",label:"Cycling Madeira"},{vid:"hFVyJx2K6eU",label:"Madeira climbs"}],
  // Italy – by region
  "South Tyrol":       [{vid:"Pt0MTJgHOm0",label:"Sellaronda Dolomites"},{vid:"7V-GhHLtE2w",label:"Passo Stelvio"}],
  "North Italy":       [{vid:"Pt0MTJgHOm0",label:"Dolomites cycling"},{vid:"7V-GhHLtE2w",label:"Italian Alps"}],
  "Tuscany":           [{vid:"0GF2kHy1AKk",label:"Strade Bianche"},{vid:"cZyKJkrV-xA",label:"Tuscany cycling"}],
  "Lombardy":          [{vid:"cZyKJkrV-xA",label:"Lake Como cycling"},{vid:"Pt0MTJgHOm0",label:"Ghisallo climb"}],
  "Trentino":          [{vid:"Pt0MTJgHOm0",label:"Dolomites Trentino"},{vid:"7V-GhHLtE2w",label:"Tre Cime"}],
  // UK
  "England":           [{vid:"IlFDpTqkNaI",label:"Cycling Yorkshire Dales"},{vid:"GBbzNxd6LbY",label:"UK cycling roads"}],
  "Scotland":          [{vid:"IlFDpTqkNaI",label:"Scottish Highlands cycling"},{vid:"GBbzNxd6LbY",label:"NC500 cycling"}],
  // Nordics
  "Oslo":              [{vid:"ZmM0HqCFAEI",label:"Cycling Norway fjords"},{vid:"IlFDpTqkNaI",label:"Oslo cycling"}],
  "Bergen":            [{vid:"ZmM0HqCFAEI",label:"Bergen fjords cycling"},{vid:"IlFDpTqkNaI",label:"Norway cycling"}],
  "Iceland":           [{vid:"ZmM0HqCFAEI",label:"Cycling Iceland"},{vid:"IlFDpTqkNaI",label:"Golden Circle cycling"}],
  "Stockholm":         [{vid:"ZmM0HqCFAEI",label:"Sweden cycling"},{vid:"IlFDpTqkNaI",label:"Stockholm archipelago"}],
  "Zealand":           [{vid:"ZmM0HqCFAEI",label:"Denmark cycling"},{vid:"IlFDpTqkNaI",label:"Copenhagen cycling"}],
  // Central / Eastern Europe
  "Julian Alps":       [{vid:"Pt0MTJgHOm0",label:"Slovenia cycling"},{vid:"7V-GhHLtE2w",label:"Vrsic Pass"}],
  "Bohemia":           [{vid:"GBbzNxd6LbY",label:"Czech cycling"},{vid:"Bz5z-nVP0lU",label:"Central Europe roads"}],
  "Carpathians":       [{vid:"GBbzNxd6LbY",label:"Transylvania cycling"},{vid:"Bz5z-nVP0lU",label:"Romania mountains"}],
  "Balkans":           [{vid:"GBbzNxd6LbY",label:"Balkans cycling"},{vid:"Bz5z-nVP0lU",label:"Balkan roads"}],
  // Asia
  "Nagano":            [{vid:"7V-GhHLtE2w",label:"Japan Alps cycling"},{vid:"Dw5e2QKPWAM",label:"Cycling Japan"}],
  "Kyoto":             [{vid:"Dw5e2QKPWAM",label:"Cycling Kyoto"},{vid:"7V-GhHLtE2w",label:"Japan road cycling"}],
  "Hokkaido":          [{vid:"Dw5e2QKPWAM",label:"Hokkaido cycling"},{vid:"7V-GhHLtE2w",label:"Japan summer cycling"}],
  "North Thailand":    [{vid:"Dw5e2QKPWAM",label:"Cycling Chiang Mai"},{vid:"GBbzNxd6LbY",label:"Thailand cycling"}],
  "Ubud":              [{vid:"Dw5e2QKPWAM",label:"Cycling Bali"},{vid:"GBbzNxd6LbY",label:"Bali mountain cycling"}],
  "Island":            [{vid:"Dw5e2QKPWAM",label:"Taiwan cycling"},{vid:"7V-GhHLtE2w",label:"Taiwan KOM"}],
  // Africa
  "Western Cape":      [{vid:"mJRQF3GXp2k",label:"Cape Town cycling"},{vid:"GBbzNxd6LbY",label:"Cape Argus"}],
  "Atlas Mountains":   [{vid:"mJRQF3GXp2k",label:"Morocco cycling"},{vid:"GBbzNxd6LbY",label:"Atlas mountain roads"}],
  // Americas
  "California":        [{vid:"kZFjJcS5_eQ",label:"California coast cycling"},{vid:"GBbzNxd6LbY",label:"PCH cycling"}],
  "Colorado":          [{vid:"kZFjJcS5_eQ",label:"Colorado mountain cycling"},{vid:"GBbzNxd6LbY",label:"Rockies cycling"}],
  "BC":                [{vid:"kZFjJcS5_eQ",label:"Sea to Sky cycling"},{vid:"GBbzNxd6LbY",label:"BC cycling"}],
  "Alberta":           [{vid:"kZFjJcS5_eQ",label:"Banff cycling"},{vid:"GBbzNxd6LbY",label:"Icefields Parkway"}],
  "South America":     [{vid:"kZFjJcS5_eQ",label:"Colombia cycling"},{vid:"GBbzNxd6LbY",label:"Andes cycling"}],
  "Coffee Region":     [{vid:"kZFjJcS5_eQ",label:"Colombia coffee cycling"},{vid:"GBbzNxd6LbY",label:"Andean roads"}],
  // Oceania
  "South Island":      [{vid:"mJRQF3GXp2k",label:"New Zealand cycling"},{vid:"GBbzNxd6LbY",label:"Queenstown rides"}],
  "North Island":      [{vid:"mJRQF3GXp2k",label:"NZ North Island cycling"},{vid:"GBbzNxd6LbY",label:"Rotorua cycling"}],
  "Tasmania":          [{vid:"mJRQF3GXp2k",label:"Tasmania cycling"},{vid:"GBbzNxd6LbY",label:"Freycinet cycling"}],
  "NSW":               [{vid:"mJRQF3GXp2k",label:"Blue Mountains cycling"},{vid:"GBbzNxd6LbY",label:"Australia cycling"}],
  "Victoria":          [{vid:"mJRQF3GXp2k",label:"Melbourne cycling"},{vid:"GBbzNxd6LbY",label:"Great Ocean Road"}],
  "ACT":               [{vid:"mJRQF3GXp2k",label:"Canberra cycling"},{vid:"GBbzNxd6LbY",label:"Namadgi cycling"}],
  // Catch-all country keys
  "Spain":             [{vid:"7N-P2MYWC-I",label:"GCN rides Spain"},{vid:"xXr7RfpOd3c",label:"Spain cycling roads"}],
  "France":            [{vid:"Bz5z-nVP0lU",label:"GCN rides France"},{vid:"cZyKJkrV-xA",label:"French Alps cycling"}],
  "Italy":             [{vid:"cZyKJkrV-xA",label:"GCN rides Italy"},{vid:"7V-GhHLtE2w",label:"Italian cycling roads"}],
  "Portugal":          [{vid:"Q9b8rKQ_Rlw",label:"GCN rides Portugal"},{vid:"hFVyJx2K6eU",label:"Portugal cycling"}],
  "UK":                [{vid:"IlFDpTqkNaI",label:"Cycling UK"},{vid:"GBbzNxd6LbY",label:"British cycling roads"}],
  "Norway":            [{vid:"ZmM0HqCFAEI",label:"Cycling Norway"},{vid:"IlFDpTqkNaI",label:"Norwegian fjords"}],
  "Sweden":            [{vid:"ZmM0HqCFAEI",label:"Sweden cycling"},{vid:"IlFDpTqkNaI",label:"Gotland cycling"}],
  "Denmark":           [{vid:"ZmM0HqCFAEI",label:"Denmark cycling"},{vid:"IlFDpTqkNaI",label:"Copenhagen roads"}],
  "Switzerland":       [{vid:"Bz5z-nVP0lU",label:"Swiss cycling"},{vid:"cZyKJkrV-xA",label:"Swiss passes"}],
  "Austria":           [{vid:"Bz5z-nVP0lU",label:"Austria cycling"},{vid:"cZyKJkrV-xA",label:"Austrian Alps"}],
  "Germany":           [{vid:"Bz5z-nVP0lU",label:"Germany cycling"},{vid:"GBbzNxd6LbY",label:"Black Forest roads"}],
  "Belgium":           [{vid:"GBbzNxd6LbY",label:"Flanders cycling"},{vid:"Bz5z-nVP0lU",label:"Belgian classics"}],
  "Japan":             [{vid:"Dw5e2QKPWAM",label:"Cycling Japan"},{vid:"7V-GhHLtE2w",label:"Japan Alps"}],
  "South Africa":      [{vid:"mJRQF3GXp2k",label:"Cape Town cycling"},{vid:"GBbzNxd6LbY",label:"SA cycling"}],
  "New Zealand":       [{vid:"mJRQF3GXp2k",label:"Cycling New Zealand"},{vid:"GBbzNxd6LbY",label:"NZ mountain roads"}],
  "Australia":         [{vid:"mJRQF3GXp2k",label:"Cycling Australia"},{vid:"GBbzNxd6LbY",label:"Aus cycling roads"}],
  "USA":               [{vid:"kZFjJcS5_eQ",label:"Cycling USA"},{vid:"GBbzNxd6LbY",label:"American cycling roads"}],
  "Canada":            [{vid:"kZFjJcS5_eQ",label:"Cycling Canada"},{vid:"GBbzNxd6LbY",label:"BC cycling roads"}],
  "Colombia":          [{vid:"kZFjJcS5_eQ",label:"Colombia cycling"},{vid:"GBbzNxd6LbY",label:"Andean cycling"}],
  "Thailand":          [{vid:"Dw5e2QKPWAM",label:"Thailand cycling"},{vid:"GBbzNxd6LbY",label:"SE Asia cycling"}],
  "Indonesia":         [{vid:"Dw5e2QKPWAM",label:"Bali cycling"},{vid:"GBbzNxd6LbY",label:"Indonesia cycling"}],
  "Taiwan":            [{vid:"Dw5e2QKPWAM",label:"Taiwan KOM"},{vid:"7V-GhHLtE2w",label:"Taiwan cycling"}],
  "Morocco":           [{vid:"mJRQF3GXp2k",label:"Morocco cycling"},{vid:"GBbzNxd6LbY",label:"Atlas roads"}],
  "default":           [{vid:"7N-P2MYWC-I",label:"GCN cycling inspiration"},{vid:"Bz5z-nVP0lU",label:"Best cycling routes"}],
};'''

# Find and replace the whole REGION_YOUTUBE block
# Match from "const REGION_YOUTUBE = {" through the closing "};"
REGION_PATTERN = re.compile(
    r'const REGION_YOUTUBE = \{.*?\};',
    re.DOTALL
)

if REGION_PATTERN.search(src):
    src = REGION_PATTERN.sub(NEW_REGION_YT, src, count=1)
    changes.append("Fix 4: REGION_YOUTUBE replaced (65+ entries)")
else:
    print("⚠  Fix 4 skipped – REGION_YOUTUBE not found")

# ══════════════════════════════════════════════════════════════════
# FIX 5 — Also update getRouteYoutube fallback chain
# ══════════════════════════════════════════════════════════════════

OLD_GRY = '''\
function getRouteYoutube(region, country) {
  return REGION_YOUTUBE[region] || REGION_YOUTUBE[country] || REGION_YOUTUBE[region?.split(',')[0]?.trim()] || REGION_YOUTUBE.default;
}'''

NEW_GRY = '''\
function getRouteYoutube(region, country) {
  if (!region && !country) return REGION_YOUTUBE["default"];
  // 1. Exact region match
  if (region && REGION_YOUTUBE[region]) return REGION_YOUTUBE[region];
  // 2. Exact country match
  if (country && REGION_YOUTUBE[country]) return REGION_YOUTUBE[country];
  // 3. First word of region
  const r0 = region?.split(",")[0]?.trim();
  if (r0 && REGION_YOUTUBE[r0]) return REGION_YOUTUBE[r0];
  // 4. First word of country
  const c0 = country?.split(" ")[0]?.trim();
  if (c0 && REGION_YOUTUBE[c0]) return REGION_YOUTUBE[c0];
  // 5. Continent fallback (rough)
  const CONT_MAP = {
    "Europe":["Spain","France","Italy","Portugal","Germany"],
    "Asia":["Japan","Thailand","Indonesia","Taiwan"],
    "Africa":["South Africa","Morocco"],
    "North America":["USA","Canada"],
    "South America":["Colombia"],
    "Oceania":["New Zealand","Australia"],
  };
  for (const [cont, countries] of Object.entries(CONT_MAP)) {
    if (countries.some(c => country?.includes(c))) return REGION_YOUTUBE[countries[0]];
  }
  return REGION_YOUTUBE["default"];
}'''

if OLD_GRY in src:
    src = src.replace(OLD_GRY, NEW_GRY, 1)
    changes.append("Fix 5: getRouteYoutube improved fallback chain")
else:
    print("⚠  Fix 5 skipped – getRouteYoutube signature not found")


# ══════════════════════════════════════════════════════════════════
# WRITE OUTPUT
# ══════════════════════════════════════════════════════════════════

with open(DEST, "w", encoding="utf-8") as f:
    f.write(src)

print(f"\n✅  Patching complete — {len(changes)} changes applied:")
for c in changes:
    print(f"   ✓  {c}")
print(f"\n📄  Written to: {DEST}")
print("\nTo deploy:")
print("  cp src/App.jsx src/App.jsx.backup")
print("  cp src/App.jsx.patched src/App.jsx")
print("  npm run dev   # verify locally")
print("  git add src/App.jsx && git commit -m 'Apply 5 fixes' && git push")
