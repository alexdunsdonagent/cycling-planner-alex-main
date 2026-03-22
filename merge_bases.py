#!/usr/bin/env python3
"""Merges newBases.js into existing bases.js, avoiding duplicates."""
import re, shutil, os

BASES_FILE = "src/data/bases.js"
NEW_BASES_FILE = "src/data/newBases.js"

if not os.path.exists(NEW_BASES_FILE):
    print("Run generate_bases.py first")
    exit(1)

shutil.copy(BASES_FILE, BASES_FILE + ".pre-merge")

with open(BASES_FILE, "r", encoding="utf-8") as f:
    bases = f.read()

with open(NEW_BASES_FILE, "r", encoding="utf-8") as f:
    new_bases = f.read()

# Extract existing names to avoid duplicates
existing_names = set(re.findall(r'name:"([^"]+)"', bases))
print(f"Existing destinations: {len(existing_names)}")

# Extract new entries and filter duplicates
new_entries = re.findall(r'\{name:"([^"]+)"[^}]+(?:\{[^}]*\}[^}]*)*\}', new_bases)
print(f"New entries found: {len(new_entries)}")

# Filter out entries that already exist
all_new = re.findall(r'\{name:"[^"]+",.*?\}(?=,|\n])', new_bases, re.DOTALL)

# Better extraction - find each {name:... } block
blocks = []
i = 0
while i < len(new_bases):
    if new_bases[i] == '{' and 'name:' in new_bases[i:i+20]:
        depth = 0
        j = i
        in_str = False
        sc = None
        while j < len(new_bases):
            c = new_bases[j]
            if in_str:
                if c == '\\': j += 2; continue
                if c == sc: in_str = False
            else:
                if c in ('"',"'",'`'): in_str = True; sc = c
                elif c == '{': depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        block = new_bases[i:j+1]
                        # Get name
                        m = re.search(r'name:"([^"]+)"', block)
                        if m:
                            name = m.group(1)
                            if name not in existing_names:
                                blocks.append(block)
                                existing_names.add(name)
                        i = j
                        break
            j += 1
    i += 1

print(f"New unique destinations to add: {len(blocks)}")

if not blocks:
    print("Nothing to add - all destinations already exist")
    exit(0)

# Find the end of the BASES array and insert before the closing ];
# The bases.js ends with "]; " or "];"
close_idx = bases.rfind("];")
if close_idx == -1:
    close_idx = bases.rfind("]")

if close_idx == -1:
    print("Could not find end of BASES array")
    exit(1)

# Find the last entry before the closing bracket
insert_point = close_idx
while insert_point > 0 and bases[insert_point-1] in (' ', '\n', '\r', '\t'):
    insert_point -= 1

new_content = ",\n".join(blocks)
bases = bases[:insert_point] + ",\n" + new_content + "\n" + bases[insert_point:]

with open(BASES_FILE, "w", encoding="utf-8") as f:
    f.write(bases)

total = len(re.findall(r'name:"', bases))
print(f"Done! Total destinations now: {total}")
print(f"Backup: {BASES_FILE}.pre-merge")
print("")
print("Now run: npm run dev")
print("If OK: git add -A && git commit -m 'Add worldwide cycling destinations' && git push")
