#!/usr/bin/env bash
# migrate-shared.sh — move src/pages/shared/ to src/shared/ and fix all imports.
#
# Run from the repo root. Commits nothing — just renames and rewrites.
# After running, do `npm run serve` to verify the build compiles, then
# `npx vitest run` to confirm tests pass.
#
set -euo pipefail

echo "=== 1. Move directory ==="
if [ -d src/shared ]; then
  echo "ERROR: src/shared already exists. Remove or rename it first."
  exit 1
fi
mv src/pages/shared src/shared
echo "  src/pages/shared/ → src/shared/"

echo ""
echo "=== 2. Fix files that import with \"pages/shared\" in the path ==="
echo "   (stores, browser/dashboard, charts, tests — just drop pages/)"
grep -rl "from.*['\"].*/pages/shared" src/ test/ --include='*.ts' 2>/dev/null | sort -u | while read -r f; do
  sed -i "s|\(from ['\"]\)\(.*\)/pages/shared/|\1\2/shared/|g" "$f"
  echo "  fixed: $f"
done

echo ""
echo "=== 3. Fix page-internal files that use \"../../shared/\" or \"../shared/\" ==="
echo "   (groups/, graphs/, and page-level config/controller/index files)"

# Files in src/pages/<page>/{groups,graphs}/ that import from "../../shared/..."
# need an extra "../" → "../../../shared/..."
find src/pages -path '*/groups/*.ts' -o -path '*/graphs/*.ts' | while read -r f; do
  if grep -q "from ['\"]\.\./\.\./shared/" "$f" 2>/dev/null; then
    sed -i "s|\(from ['\"]\)\.\./\.\./shared/|\1../../../shared/|g" "$f"
    echo "  fixed: $f"
  fi
done

# Files in src/pages/<page>/ (config.ts, controller.ts, index.ts) that import
# from "../shared/..." need an extra "../" → "../../shared/..."
find src/pages -maxdepth 2 -name '*.ts' ! -path '*/groups/*' ! -path '*/graphs/*' ! -path '*/shared/*' | while read -r f; do
  if grep -q "from ['\"]\.\./shared/" "$f" 2>/dev/null; then
    sed -i "s|\(from ['\"]\)\.\./shared/|\1../../shared/|g" "$f"
    echo "  fixed: $f"
  fi
done

echo ""
echo "=== 4. Fix internal imports within the moved directory ==="
echo "   (root-level shared/*.ts used ../../ → now ../ for src/ children)"

# Root-level files in src/shared/*.ts
find src/shared -maxdepth 1 -name '*.ts' | while read -r f; do
  # Replace ../../stores/  →  ../stores/
  sed -i "s|\(from ['\"]\)\.\./\.\./stores/|\1../stores/|g" "$f"
  # Replace ../../charts/  →  ../charts/
  sed -i "s|\(from ['\"]\)\.\./\.\./charts/|\1../charts/|g" "$f"
  # Replace ../../browser/ →  ../browser/
  sed -i "s|\(from ['\"]\)\.\./\.\./browser/|\1../browser/|g" "$f"
  # Replace ../../json/    →  ../json/
  sed -i "s|\(from ['\"]\)\.\./\.\./json/|\1../json/|g" "$f"
  echo "  fixed internal: $f"
done

echo ""
echo "=== 5. Fix graph subdirectory imports (../../../ → ../../) ==="
echo "   (graphs/ were 3 levels deep, now 2)"

find src/shared/graphs -name '*.ts' | while read -r f; do
  # Replace ../../../charts → ../../charts (with or without trailing slash)
  sed -i "s|\(from ['\"]\)\.\./\.\./\.\./charts|\1../../charts|g" "$f"
  # Replace ../../../stores/ → ../../stores/
  sed -i "s|\(from ['\"]\)\.\./\.\./\.\./stores/|\1../../stores/|g" "$f"
  # Replace ../../../img-modules/ → ../../img-modules/
  sed -i "s|\(from ['\"]\)\.\./\.\./\.\./img-modules/|\1../../img-modules/|g" "$f"
  echo "  fixed graph: $f"
done

echo ""
echo "=== 6. Fix html subdirectory imports (../../ → same ../ for src/ children) ==="
echo "   (html/ was 2 levels deep, still 2 levels — but targets changed)"

find src/shared/html -name '*.ts' | while read -r f; do
  # Replace ../../{stores,charts,browser,json} → ../../{stores,charts,browser,json} stays same!
  # But ../../shared/ references need fixing
  # Actually check: are there any ../../shared/ inside html/? That was a weird pattern.
  if grep -q "from ['\"]\.\./\.\./shared/" "$f" 2>/dev/null; then
    sed -i "s|\(from ['\"]\)\.\./\.\./shared/|\1../|g" "$f"
    echo "  fixed html: $f"
  fi
done

echo ""
echo "=== 7. Fix factories/ imports (same depth as root) ==="
find src/shared/factories -name '*.ts' | while read -r f; do
  # Replace ../../stores/ → ../stores/
  sed -i "s|\(from ['\"]\)\.\./\.\./stores/|\1../stores/|g" "$f"
  # Replace ../../charts/ → ../charts/
  sed -i "s|\(from ['\"]\)\.\./\.\./charts/|\1../charts/|g" "$f"
  # Replace ../../browser/ → ../browser/
  sed -i "s|\(from ['\"]\)\.\./\.\./browser/|\1../browser/|g" "$f"
  # Replace ../../json/ → ../json/
  sed -i "s|\(from ['\"]\)\.\./\.\./json/|\1../json/|g" "$f"
  echo "  fixed factory: $f"
done

echo ""
echo "=== 8. Fix graph/ internal references to ../ (interfaces, types, etc.) ==="
echo "   (these are relative within shared/ — should be the same after move)"
# No changes needed — ../ in graph/ still points to src/shared/ which is correct

echo ""
echo "=== Done. Verify with: ==="
echo "  npm run serve   # (or npx webpack ... to check compilation)"
echo "  npx vitest run  # (test imports also migrated)"