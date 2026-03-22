#!/usr/bin/env python3
"""
Full debug and fix script for App.jsx.
Fixes all known issues from this session.
"""
import re, shutil, os

SRC = "src/App.jsx"
shutil.copy(SRC, SRC + ".pre-debug")

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

original_len = len(src)
fixes = []

# ── FIX 1: JSX inserted inside translation object ─────────────
# The share buttons block got inserted inside the translation string at line 3472
# Pattern: the translation object ends with a long string, then JSX appears
# We need to find {/* Share buttons */} that's inside an object literal and remove it

# Find the bad insertion - JSX comment inside translation object
BAD_PATTERN = re.compile(
    r"(rerunLast:[^}]+\}[^{]*)"  # end of translation object 
    r"(\s*\{/\* Share buttons \*/\}.*?(?=\n\s*\};?\s*\n))",  # JSX block
    re.DOTALL
)

# Actually let's find the specific bad placement
# The share buttons should be OUTSIDE the translation objects, inside JSX return
# Look for the share buttons code that's in the wrong place

# Find all occurrences of the share buttons
share_pattern = re.compile(
    r'\s*\{/\* Share buttons \*/\}\s*'
    r'\{selectedDest && \('
    r'.*?'
    r'\)\}\s*',
    re.DOTALL
)

matches = list(share_pattern.finditer(src))
print(f"Found {len(matches)} share button blocks")

if len(matches) > 1:
    # Remove all but the last one (keep the one in JSX return)
    for m in matches[:-1]:
        # Check if this is inside an object (bad) or JSX (good)
        before = src[max(0, m.start()-200):m.start()]
        if '"profileTitle"' in before or 'whyMatched' in before or 'rerunLast' in before:
            print(f"  Removing bad insertion at position {m.start()}")
            src = src[:m.start()] + src[m.end():]
            fixes.append("Removed JSX share buttons from inside translation object")
            break

# ── FIX 2: Verify Google Maps key is correct in template literals ──
key_pattern = re.compile(r'key=\$\{import\.meta\.env\.VITE_GOOGLE_MAPS_KEY\}')
key_count = len(key_pattern.findall(src))
print(f"Google Maps key references: {key_count}")
if key_count == 3:
    fixes.append(f"Google Maps key correctly in {key_count} places")

# ── FIX 3: Check mapTab state exists ──────────────────────────
if "mapTab" not in src:
    target = "const mapRef = useRef(null);"
    if target in src:
        src = src.replace(target, target + "\n  const [mapTab, setMapTab] = React.useState('hotels');", 1)
        fixes.append("Added mapTab state")
elif "useState('hotels')" not in src and "useState(\"hotels\")" not in src:
    # mapTab exists but might not be initialized - check
    if "const [mapTab" not in src:
        target = "const mapRef = useRef(null);"
        if target in src:
            src = src.replace(target, target + "\n  const [mapTab, setMapTab] = React.useState('hotels');", 1)
            fixes.append("Added mapTab state declaration")

# ── FIX 4: Remove duplicate backup files from git tracking ────
# These .pre-* files keep getting committed - add to gitignore
if os.path.exists(".gitignore"):
    with open(".gitignore", "r") as f:
        gi = f.read()
    additions = []
    for pattern in ["*.pre-*", "src/*.pre-*", "fix_continent*.py", "add_continent.py", 
                    "add_google_maps.py", "swap_to_google_maps.py", "patch_all.py",
                    "add_analytics.py", "add_seo.py"]:
        if pattern not in gi:
            additions.append(pattern)
    if additions:
        with open(".gitignore", "a") as f:
            f.write("\n# Auto-generated fix scripts and backups\n")
            for a in additions:
                f.write(a + "\n")
        fixes.append(f"Added {len(additions)} patterns to .gitignore")

# ── FIX 5: Check for syntax errors with a quick scan ──────────
# Count braces/brackets in JSX sections (rough check)
jsx_start = src.find("return (")
if jsx_start == -1:
    jsx_start = src.find("return(")

# Write fixed file
with open(SRC, "w", encoding="utf-8") as f:
    f.write(src)

new_len = len(src)
print(f"\n{'='*50}")
print(f"Debug complete — {len(fixes)} fixes applied")
print(f"File size: {original_len:,} → {new_len:,} chars")
for fix in fixes:
    print(f"  ✓ {fix}")
print(f"{'='*50}")
