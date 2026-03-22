#!/bin/bash
# install_all.sh — run from ~/cycling-planner/
# Does everything: patches app, copies files, builds, pushes live
set -e

echo ""
echo "════════════════════════════════════════"
echo "  Cycling Planner — Pre-Launch Install"
echo "════════════════════════════════════════"
echo ""

[[ ! -f "package.json" ]] && echo "ERROR: Run from ~/cycling-planner/" && exit 1

DOWNLOADS=~/Downloads

# ── Copy downloaded files into place ─────────────────────────
echo "→ Copying files..."

[[ -f "$DOWNLOADS/patch_all.py" ]]     && cp "$DOWNLOADS/patch_all.py" .
[[ -f "$DOWNLOADS/add_analytics.py" ]] && cp "$DOWNLOADS/add_analytics.py" .
[[ -f "$DOWNLOADS/prerender.js" ]]     && cp "$DOWNLOADS/prerender.js" .
[[ -f "$DOWNLOADS/404.html" ]]         && cp "$DOWNLOADS/404.html" public/

# Update index.html (keep backup)
if [[ -f "$DOWNLOADS/index.html" ]]; then
  cp index.html index.html.pre-launch
  cp "$DOWNLOADS/index.html" index.html
  echo "  ✓ index.html updated"
fi

# Update worker
if [[ -f "$DOWNLOADS/worker-complete.js" ]]; then
  echo "  ℹ  Worker file downloaded — deploy separately (see step 4)"
fi

# ── Run patches ───────────────────────────────────────────────
echo "→ Patching App.jsx..."
python3 patch_all.py

echo "→ Adding analytics tracking..."
python3 add_analytics.py

# ── Update package.json to include prerender in build ─────────
echo "→ Updating build script..."
python3 -c "
import json
with open('package.json') as f:
    pkg = json.load(f)
build = pkg.get('scripts', {}).get('build', '')
if 'prerender' not in build:
    pkg['scripts']['build'] = build.rstrip() + ' && node prerender.js'
    with open('package.json', 'w') as f:
        json.dump(pkg, f, indent=2)
    print('  ✓ package.json build script updated')
else:
    print('  ✓ package.json already includes prerender')
"

# ── Build ─────────────────────────────────────────────────────
echo "→ Building..."
npm run build 2>&1 | tail -8

if [[ -d "dist/destination" ]]; then
  COUNT=$(ls dist/destination/ | wc -l | tr -d ' ')
  echo "  ✓ Generated $COUNT destination pages"
else
  echo "  ⚠  No destination pages generated — check prerender.js"
fi

[[ -f "dist/sitemap.xml" ]] && echo "  ✓ sitemap.xml generated" || echo "  ⚠  sitemap.xml missing"
[[ -f "dist/robots.txt" ]]  && echo "  ✓ robots.txt generated"  || echo "  ⚠  robots.txt missing"

# ── Push live ─────────────────────────────────────────────────
echo "→ Pushing to GitHub..."
git add -A
git commit -m "Pre-launch: KV data, social sharing, print summary, SEO, analytics, 404 page"
git push

echo ""
echo "════════════════════════════════════════"
echo "  ✓ DONE — deploying to Cloudflare Pages"
echo "════════════════════════════════════════"
echo ""
echo "4 more manual steps:"
echo ""
echo "1. DEPLOY WORKER — replace your main worker with worker-complete.js:"
echo "   Go to Cloudflare Dashboard → Workers → cyclingplanner → Edit code"
echo "   Paste the contents of worker-complete.js → Save and Deploy"
echo ""
echo "2. BIND KV — if not already done:"
echo "   Workers → cyclingplanner → Settings → Variables"
echo "   Add KV binding: DEST_DATA = cycling-dest-data"
echo ""
echo "3. GOOGLE ANALYTICS — get your GA4 Measurement ID:"
echo "   Go to analytics.google.com → create property for cycling-planner.pages.dev"
echo "   Replace G-XXXXXXXXXX in index.html with your real ID"
echo "   Then: git add index.html && git commit -m 'Add GA4' && git push"
echo ""
echo "4. GOOGLE SEARCH CONSOLE — submit your sitemap:"
echo "   search.google.com/search-console"
echo "   Add property → cycling-planner.pages.dev"
echo "   Sitemaps → submit: sitemap.xml"
echo ""
echo "Live in ~2 minutes: https://cycling-planner.pages.dev"
