#!/usr/bin/env python3
"""Removes the broken inline T object from App.jsx (it's now in translations.js)"""
import re

APP = "src/App.jsx"
with open(APP, "r", encoding="utf-8") as f:
    src = f.read()

# Find start of T object - could be "const T = {" or "export const T = {"
start = None
for pattern in ["\nconst T = {", "\nexport const T = {", "\nconst T={"]:
    idx = src.find(pattern)
    if idx != -1:
        start = idx
        break

if start is None:
    print("T object not found in App.jsx - nothing to remove")
    exit(0)

print(f"Found T at position {start}")

# Walk braces to find end
depth = 0
i = src.find("{", start)
in_str = False
sc = None
while i < len(src):
    c = src[i]
    if in_str:
        if c == '\\': i += 2; continue
        if c == sc: in_str = False
    else:
        if c in ('"',"'",'`'): in_str = True; sc = c
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                # Include the semicolon
                end = i + 1
                if end < len(src) and src[end] == ';':
                    end += 1
                print(f"T object spans positions {start} to {end} ({end-start} chars)")
                # Remove it
                src = src[:start] + src[end:]
                print("✅ Removed T object from App.jsx")
                break
    i += 1

# Make sure T is imported from translations.js
if "from './data/translations.js'" not in src and "from \"./data/translations.js\"" not in src:
    # Add import after React import
    src = src.replace(
        'import React,',
        "import { T } from './data/translations.js';\nimport React,"
    )
    print("✅ Added T import")
else:
    print("✅ T import already present")

with open(APP, "w", encoding="utf-8") as f:
    f.write(src)

print("\nDone. Run: npm run dev")
