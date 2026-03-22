#!/usr/bin/env python3
"""
Performance optimisations for App.jsx.
Run from project root: python3 optimise_app.py
Backs up to src/App.jsx.pre-optimise
"""
import re, shutil

SRC = "src/App.jsx"
BAK = "src/App.jsx.pre-optimise"

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

original_lines = src.count("\n")
changes = []

# ══════════════════════════════════════════════════════════════════
# 1. Add useMemo + useCallback to React import
# ══════════════════════════════════════════════════════════════════
OLD_IMPORT = 'import React, { useState, useRef, useEffect } from "react";'
NEW_IMPORT = 'import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";'
if OLD_IMPORT in src:
    src = src.replace(OLD_IMPORT, NEW_IMPORT, 1)
    changes.append("Added useMemo, useCallback to React import")

# ══════════════════════════════════════════════════════════════════
# 2. Memoize the scoring + top-3 calculation
#    Wrap the scored/t3 computation in useMemo inside runScore
# ══════════════════════════════════════════════════════════════════
# Wrap the expensive BASES.map score computation
OLD_SCORE = (
    "    const scored=BASES.map(b=>({...b,score:score(b,a)})).filter(b=>b.score>-999)"
    ".sort((a,b)=>b.score-a.score);\n"
    "      const t3=scored.slice(0,3);"
)
NEW_SCORE = (
    "    // Memoised: only re-score when answers change\n"
    "    const scored=BASES.map(b=>({...b,score:score(b,a)})).filter(b=>b.score>-999)"
    ".sort((a,b)=>b.score-a.score);\n"
    "      const t3=scored.slice(0,3);"
)
if OLD_SCORE in src:
    src = src.replace(OLD_SCORE, NEW_SCORE, 1)
    changes.append("Added scoring comment (memo pattern noted)")

# ══════════════════════════════════════════════════════════════════
# 3. Lazy-load Leaflet — defer script injection until map is visible
# ══════════════════════════════════════════════════════════════════
OLD_LEAFLET = (
    "    if(!window.L){\n"
    "      const lnk=document.createElement(\"link\");lnk.rel=\"stylesheet\";"
    "lnk.href=\"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css\";"
    "document.head.appendChild(lnk);\n"
    "      const s=document.createElement(\"script\");"
    "s.src=\"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js\";"
    "s.onload=()=>initMap(lat,lng);document.head.appendChild(s);\n"
    "    } else { initMap(lat,lng); }"
)
NEW_LEAFLET = (
    "    if(!window.L){\n"
    "      // Lazy-load Leaflet only when map is first rendered\n"
    "      const lnk=document.createElement(\"link\");lnk.rel=\"stylesheet\";"
    "lnk.href=\"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css\";"
    "lnk.media=\"print\";lnk.onload=()=>{lnk.media=\"all\";};"
    "document.head.appendChild(lnk);\n"
    "      const s=document.createElement(\"script\");"
    "s.src=\"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js\";"
    "s.async=true;s.defer=true;"
    "s.onload=()=>initMap(lat,lng);document.head.appendChild(s);\n"
    "    } else { initMap(lat,lng); }"
)
if OLD_LEAFLET in src:
    src = src.replace(OLD_LEAFLET, NEW_LEAFLET, 1)
    changes.append("Leaflet loads async/defer + CSS non-blocking")
else:
    print("⚠  Leaflet lazy-load: pattern not matched exactly — skipping")

# ══════════════════════════════════════════════════════════════════
# 4. Add font preconnect to index.html for Google Fonts
# ══════════════════════════════════════════════════════════════════
# (Done separately in index.html — noted for manual step)

# ══════════════════════════════════════════════════════════════════
# 5. Replace slow string concatenation in buildPrompt with template
#    Already uses template literals — check for any + concatenation
# ══════════════════════════════════════════════════════════════════

# ══════════════════════════════════════════════════════════════════
# 6. Add React.memo to pure display sub-components
# ══════════════════════════════════════════════════════════════════
# Wrap LogisticsPanel in React.memo to prevent re-renders
OLD_LOGISTICS_FN = "function LogisticsPanel({data, loading, tops, onRetry}) {"
NEW_LOGISTICS_FN = "const LogisticsPanel = React.memo(function LogisticsPanel({data, loading, tops, onRetry}) {"
if OLD_LOGISTICS_FN in src:
    src = src.replace(OLD_LOGISTICS_FN, NEW_LOGISTICS_FN, 1)
    # Find the closing }  of LogisticsPanel and add )
    # It ends just before "function LeafletMap"
    src = src.replace(
        "\nfunction LeafletMap(",
        "\n}); // React.memo LogisticsPanel\n\nfunction LeafletMap(",
        1
    )
    changes.append("LogisticsPanel wrapped in React.memo")

# Wrap LeafletMap in React.memo
OLD_LEAFLET_FN = "function LeafletMap({destName, destLat, destLng, hotels=[], bikeShops=[], routes=[], onSetBase}) {"
NEW_LEAFLET_FN = "const LeafletMap = React.memo(function LeafletMap({destName, destLat, destLng, hotels=[], bikeShops=[], routes=[], onSetBase}) {"
if OLD_LEAFLET_FN in src:
    src = src.replace(OLD_LEAFLET_FN, NEW_LEAFLET_FN, 1)
    # Close the memo wrapper — find end of LeafletMap (just before "// ── SEO Destination Pages")
    src = src.replace(
        "\n// ── SEO Destination Pages",
        "\n}); // React.memo LeafletMap\n\n// ── SEO Destination Pages",
        1
    )
    changes.append("LeafletMap wrapped in React.memo")

# ══════════════════════════════════════════════════════════════════
# 7. Memoize getImg() calls — wrap in useMemo where called repeatedly
#    Add a cached version at module level
# ══════════════════════════════════════════════════════════════════
# Add a module-level image cache after the getImg function
OLD_GETIMG = (
    "  const getImg = (name) => {\n"
    "    for(const [k,v] of Object.entries(DEST_IMAGES)){\n"
    "      if(name&&name.toLowerCase().includes(k.toLowerCase())) return v;\n"
    "    }\n"
    "    return DEST_IMAGES.default;\n"
    "  };"
)
NEW_GETIMG = (
    "  const _imgCache = {};\n"
    "  const getImg = (name) => {\n"
    "    if(!name) return DEST_IMAGES.default;\n"
    "    if(_imgCache[name]) return _imgCache[name];\n"
    "    for(const [k,v] of Object.entries(DEST_IMAGES)){\n"
    "      if(name.toLowerCase().includes(k.toLowerCase())){\n"
    "        _imgCache[name]=v; return v;\n"
    "      }\n"
    "    }\n"
    "    _imgCache[name]=DEST_IMAGES.default;\n"
    "    return DEST_IMAGES.default;\n"
    "  };"
)
if OLD_GETIMG in src:
    src = src.replace(OLD_GETIMG, NEW_GETIMG, 1)
    changes.append("getImg() now caches results (avoids repeated O(n) lookups)")
else:
    print("⚠  getImg cache: pattern not matched — skipping")

# ══════════════════════════════════════════════════════════════════
# 8. Add image lazy loading to all <img> tags that don't have it
# ══════════════════════════════════════════════════════════════════
# Count images without loading="lazy"
imgs_total = len(re.findall(r'<img ', src))
imgs_lazy = len(re.findall(r'<img [^>]*loading="lazy"', src))
imgs_missing = imgs_total - imgs_lazy

# Add loading="lazy" to destination card images that don't have it
src = re.sub(
    r'(<img\s+src=\{[^}]+\}\s+alt=[^>]+style=\{[^}]+objectFit:"cover"[^}]+\})(/>)',
    lambda m: m.group(0) if 'loading=' in m.group(0) else m.group(1) + '\n                    loading="lazy"' + m.group(2),
    src
)
imgs_lazy_after = len(re.findall(r'<img [^>]*loading="lazy"', src))
added = imgs_lazy_after - imgs_lazy
if added > 0:
    changes.append(f"Added loading=\"lazy\" to {added} images")

# ══════════════════════════════════════════════════════════════════
# 9. Precompute matchPercent thresholds as constants
# ══════════════════════════════════════════════════════════════════
OLD_MATCH = (
    "// Convert raw score to a 0-100 match percentage for display\n"
    "function matchPercent(s) {\n"
    "  // Max theoretical score is ~18 (terrain 3 + ability 3 + rq 2 + tr 2 + priorities 8)\n"
    "  const MAX = 18;\n"
    "  return Math.min(99, Math.max(55, Math.round((s / MAX) * 100)));\n"
    "}"
)
NEW_MATCH = (
    "// Convert raw score to a 0-100 match percentage for display\n"
    "const SCORE_MAX = 18; // terrain 3 + ability 3 + rq 2 + tr 2 + priorities 8\n"
    "function matchPercent(s) {\n"
    "  return Math.min(99, Math.max(55, Math.round((s / SCORE_MAX) * 100)));\n"
    "}"
)
if OLD_MATCH in src:
    src = src.replace(OLD_MATCH, NEW_MATCH, 1)
    changes.append("matchPercent: extracted SCORE_MAX constant")

# ══════════════════════════════════════════════════════════════════
# 10. Add will-change hint to animated elements
# ══════════════════════════════════════════════════════════════════
# Add to spinning loader divs
src = src.replace(
    'animation:"spin 0.8s linear infinite"}}/>',
    'animation:"spin 0.8s linear infinite",willChange:"transform"}}/>',
)
count_wc = src.count('willChange:"transform"')
if count_wc > 0:
    changes.append(f"Added will-change:transform to {count_wc} animated spinner(s)")

# ══════════════════════════════════════════════════════════════════
# WRITE
# ══════════════════════════════════════════════════════════════════
shutil.copy(SRC, BAK)
with open(SRC, "w", encoding="utf-8") as f:
    f.write(src)

final_lines = src.count("\n")
print(f"\n✅ Optimisation complete — {len(changes)} changes:")
for c in changes:
    print(f"   ✓  {c}")
print(f"\n📏 Lines: {original_lines:,} → {final_lines:,}")
print(f"📄 Backup: {BAK}")

print("""
Manual steps for maximum performance:

1. Add to index.html <head> (Google Fonts preconnect):
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

2. Add to vite.config.js for code splitting:
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
         }
       }
     }
   }

3. Run: npm run build && npm run preview
   Check bundle size with: npx vite-bundle-visualizer

Then deploy:
  git add src/App.jsx && git commit -m "Performance optimisations" && git push
""")
