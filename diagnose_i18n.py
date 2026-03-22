#!/usr/bin/env python3
"""Fixes the broken i18n keys that were inserted in the wrong place."""
import re, shutil

SRC = "src/App.jsx"

# Restore from backup
import os
if os.path.exists("src/App.jsx.pre-i18n"):
    shutil.copy("src/App.jsx.pre-i18n", SRC)
    print("✅ Restored from backup")
else:
    print("⚠  No backup found, working with current file")

with open(SRC, "r", encoding="utf-8") as f:
    src = f.read()

# Find what the actual last keys look like in the T object
# Search for the en: language block
lines = src.split("\n")
t_start = None
for i, line in enumerate(lines):
    if re.match(r'\s*en:\s*\{', line):
        t_start = i
        break

if t_start:
    print(f"Found en: block at line {t_start+1}")
    # Print lines around there to find a good anchor
    for j in range(t_start, min(t_start+20, len(lines))):
        print(f"  {j+1}: {lines[j]}")
    print("  ...")
    # Find closing of en block
    depth = 0
    en_end = None
    for j in range(t_start, min(t_start+2000, len(lines))):
        depth += lines[j].count('{') - lines[j].count('}')
        if depth <= 0 and j > t_start:
            en_end = j
            break
    if en_end:
        print(f"\nLast 5 lines of en block (lines {en_end-4} to {en_end+1}):")
        for j in range(max(0,en_end-4), en_end+1):
            print(f"  {j+1}: {lines[j]}")
else:
    print("❌ Could not find en: block")
    # Search for T = { pattern
    for i, line in enumerate(lines[:100]):
        if 'const T' in line or 'export const T' in line:
            print(f"Found T at line {i+1}: {line}")

print("\nRun this script to diagnose, then paste output here.")
