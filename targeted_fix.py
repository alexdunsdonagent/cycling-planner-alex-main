#!/usr/bin/env python3
"""
Targeted fix for the syntax error at line 3473.
The share buttons JSX was inserted inside a translation object literal.
"""
import re, shutil

SRC = "src/App.jsx"
shutil.copy(SRC, SRC + ".pre-targeted")

with open(SRC, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# Show lines around the error
print("\nLines 3468-3485:")
for i, line in enumerate(lines[3467:3485], start=3468):
    print(f"  {i}: {line}", end="")

# Find where the share buttons block starts (the bad insertion)
# It should be around line 3473
bad_start = None
bad_end = None

for i, line in enumerate(lines):
    if '{/* Share buttons */}' in line and i > 3400 and i < 3550:
        # Check if this is inside an object (bad location)
        # Look back 5 lines for signs of being in a translation object
        context = ''.join(lines[max(0,i-5):i])
        if 'rerunLast' in context or 'profileTitle' in context or 'whyMatched' in context:
            bad_start = i
            print(f"\nFound BAD share buttons insertion at line {i+1}")
            # Find end of this block (look for matching closing )})
            depth = 0
            for j in range(i, min(i+60, len(lines))):
                for ch in lines[j]:
                    if ch == '(': depth += 1
                    elif ch == ')': depth -= 1
                if depth <= 0 and j > i + 5:
                    bad_end = j + 1
                    break
            print(f"Block ends around line {bad_end+1 if bad_end else '?'}")
            break

if bad_start is not None and bad_end is not None:
    # Extract the block
    removed_block = lines[bad_start:bad_end]
    print(f"\nRemoving {len(removed_block)} lines ({bad_start+1} to {bad_end})")
    
    # Remove the bad block
    new_lines = lines[:bad_start] + lines[bad_end:]
    
    with open(SRC, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("✓ Removed bad insertion")
    print("\nNow run: npm run dev")
    print("The share buttons should still exist elsewhere in the file in the right place")
else:
    print("\nCould not find bad insertion — trying alternate approach")
    # Just find and show lines 3470-3490 for manual inspection
    print("Lines around error:")
    for i, line in enumerate(lines[3468:3492], start=3469):
        print(f"  {i}: {repr(line[:80])}")

