#!/usr/bin/env python3
"""
Fixes the broken React.memo wrapping from optimise_app.py.
Restores from backup and re-applies only the safe optimisations.
Run from project root: python3 fix_optimise.py
"""
import re, shutil, os

BAK = "src/App.jsx.pre-optimise"
SRC = "src/App.jsx"

# Restore from backup
if os.path.exists(BAK):
    shutil.copy(BAK, SRC)
    print(f"✅ Restored from {BAK}")
else:
    print("⚠  No backup found — working with current file")

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

changes = []

# ══════════════════════════════════════════════════════════════════
# 1. useMemo + useCallback in import
# ══════════════════════════════════════════════════════════════════
OLD_IMPORT = 'import React, { useState, useRef, useEffect } from "react";'
NEW_IMPORT = 'import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";'
if OLD_IMPORT in src:
    src = src.replace(OLD_IMPORT, NEW_IMPORT, 1)
    changes.append("Added useMemo, useCallback to React import")

# ══════════════════════════════════════════════════════════════════
# 2. Leaflet loads async + CSS non-blocking
# ══════════════════════════════════════════════════════════════════
OLD_SCRIPT = 's.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";s.onload=()=>initMap(lat,lng);document.head.appendChild(s);'
NEW_SCRIPT = 's.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";s.async=true;s.defer=true;s.onload=()=>initMap(lat,lng);document.head.appendChild(s);'
if OLD_SCRIPT in src:
    src = src.replace(OLD_SCRIPT, NEW_SCRIPT, 1)
    changes.append("Leaflet script loads async+defer")

# ══════════════════════════════════════════════════════════════════
# 3. getImg cache
# ══════════════════════════════════════════════════════════════════
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
    changes.append("getImg() caches results")

# ══════════════════════════════════════════════════════════════════
# 4. SCORE_MAX constant
# ══════════════════════════════════════════════════════════════════
OLD_MATCH = (
    "function matchPercent(s) {\n"
    "  // Max theoretical score is ~18 (terrain 3 + ability 3 + rq 2 + tr 2 + priorities 8)\n"
    "  const MAX = 18;\n"
    "  return Math.min(99, Math.max(55, Math.round((s / MAX) * 100)));\n"
    "}"
)
NEW_MATCH = (
    "const SCORE_MAX = 18;\n"
    "function matchPercent(s) {\n"
    "  return Math.min(99, Math.max(55, Math.round((s / SCORE_MAX) * 100)));\n"
    "}"
)
if OLD_MATCH in src:
    src = src.replace(OLD_MATCH, NEW_MATCH, 1)
    changes.append("matchPercent: extracted SCORE_MAX constant")

# ══════════════════════════════════════════════════════════════════
# 5. will-change on spinners
# ══════════════════════════════════════════════════════════════════
before = src.count('willChange:"transform"')
src = src.replace(
    'animation:"spin 0.8s linear infinite"}}/>',
    'animation:"spin 0.8s linear infinite",willChange:"transform"}}/>',
)
added = src.count('willChange:"transform"') - before
if added > 0:
    changes.append(f"Added will-change:transform to {added} spinner(s)")

# ══════════════════════════════════════════════════════════════════
# WRITE
# ══════════════════════════════════════════════════════════════════
with open(SRC, "w", encoding="utf-8") as f:
    f.write(src)

print(f"\n✅ {len(changes)} optimisations applied:")
for c in changes:
    print(f"   ✓  {c}")
print("\nNow run: npm run dev")
print("Then:    git add src/App.jsx && git commit -m 'Safe performance optimisations' && git push")
