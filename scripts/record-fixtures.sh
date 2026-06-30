#!/usr/bin/env bash
# record-fixtures — pull raw API payloads from IMG staging for test fixtures.
#
# Usage:
#   scripts/record-fixtures.sh <page>/<group> <endpoint> [<endpoint> ...]
#   scripts/record-fixtures.sh <page>/<group>   # auto-extract from config
#
# Examples:
#   scripts/record-fixtures.sh regelingen/all_totals \
#     "regelingen?aggregatie=eq.week&domein_code=eq.Totaal&regeling_code=eq.Totaal&order=periode.desc&periode_vanaf=gte.2025-01-01" \
#     "regelingen?aggregatie=eq.maand&domein_code=eq.Totaal&regeling_code=eq.Totaal"
#
#   scripts/record-fixtures.sh fs_overzicht/fs_totals   # auto-extract
#
# Auto-extraction reads the page config and tries to find the group's
# endpoints.  If the group has `endpoints: []` or no endpoints key,
# page-level endpoints are used.
#
# Run from the repo root.  Requires curl; jq optional (prettifies JSON).

set -euo pipefail

DOMAIN="${DOMAIN:-https://img.de-publieke-zaak.nl}"
APIBASE="${APIBASE:-/open-data/staging/api/}"

SPEC="${1:-}"
shift 2>/dev/null || true
MANUAL_EPS=("$@")

if [ -z "$SPEC" ]; then
  echo "Usage: $0 <page/group> [<endpoint> ...]"
  echo ""
  echo "  $0 regelingen/all_totals \"regelingen?...\" \"regelingen?...\""
  echo "  $0 fs_overzicht/fs_totals"
  exit 1
fi

PAGE="${SPEC%%/*}"
GROUP="${SPEC#*/}"
CONFIG="src/pages/${PAGE}/config.ts"
OUTDIR="test/fixtures/${PAGE}/${GROUP}"

# ---- endpoint resolution ------------------------------------------------
ENDPOINTS=()

if [ ${#MANUAL_EPS[@]} -gt 0 ]; then
  # Endpoints provided explicitly on CLI
  for ep in "${MANUAL_EPS[@]}"; do
    resolved="${ep//\{GEMEENTE\}/all}"
    resolved="${resolved//\{VANAF\}/2025-01-01}"
    ENDPOINTS+=("$resolved")
  done
else
  # Auto-extract from config.  Works by sed'ing the config into a
  # single-line-per-group form, then grepping the target group's block.
  if [ ! -f "$CONFIG" ]; then
    echo "Config not found: $CONFIG"
    exit 1
  fi

  # strategy: extract page-level endpoints first
  PAGE_EPS=$(sed -n '/^ *endpoints: *\[/,/^ *\]/'p "$CONFIG" \
    | grep -E '"[^"]+"' \
    | sed 's/.*"\([^"]*\)".*/\1/' \
    | head -2)  # only the first endpoints block (page level)

  # now try to find group-level endpoints
  # strip comments, find the group block, extract its endpoints array
  GROUP_EPS=$(sed -e 's|//.*||' "$CONFIG" \
    | awk -v group="$GROUP" '
      BEGIN { in_group=0; hit=0 }
      /slug: *"/ {
        gsub(/.*slug: *"/, ""); gsub(/".*/, "");
        hit = ($0 == group) ? 1 : 0
        in_group = 0
        next
      }
      hit && /endpoints: *\[/ {
        in_group = 1
        # check if empty on same line (endpoints: [],)
        if (/\[\s*,?\s*\]/) { in_group=0; hit=0 }
        next
      }
      hit && in_group && /\]/ { in_group=0; hit=0; next }
      hit && in_group && /"[^"]*"/ {
        gsub(/.*"/, ""); gsub(/".*/, ""); print
      }
      # if we hit another top-level key before endpoints, use page defaults
      hit && !in_group && /^ *[a-z]/ && !/slug|segment|filters|ctrlr|graphs|functionality|header|description|publishDate|timeline|definitions|endpoints/ { hit=0; next }
    ')

  if [ -z "$GROUP_EPS" ]; then
    # Fall back to page-level endpoints (substituting vars)
    GROUP_EPS="$PAGE_EPS"
  fi

  while IFS= read -r ep; do
    [ -z "$ep" ] && continue
    resolved="${ep//\{GEMEENTE\}/all}"
    resolved="${resolved//\{VANAF\}/2025-01-01}"
    ENDPOINTS+=("$resolved")
  done <<< "$GROUP_EPS"
fi

if [ ${#ENDPOINTS[@]} -eq 0 ]; then
  echo "ERROR: no endpoints found. Provide them explicitly:"
  echo "  $0 ${PAGE}/${GROUP} \"endpoint1\" \"endpoint2\""
  exit 1
fi

# ---- fetch & save -------------------------------------------------------
mkdir -p "$OUTDIR"
echo "==> Recording ${PAGE}/${GROUP} @ ${DOMAIN}${APIBASE}"
echo ""

i=1
for ep in "${ENDPOINTS[@]}"; do
  # Label: week / month / epN
  if [[ "$ep" == *"eq.week"* ]]; then label="week"
  elif [[ "$ep" == *"eq.maand"* ]]; then label="month"
  else label="ep${i}"
  fi

  url="${DOMAIN}${APIBASE}${ep}"
  filepath="${OUTDIR}/${label}.json"

  echo "  [$i] ${label}"
  echo "       GET ${url}"
  echo "       → ${filepath}"

  if curl -sSf "$url" -o "${filepath}.tmp" 2>/dev/null; then
    if command -v jq &>/dev/null; then
      jq '.' "${filepath}.tmp" > "$filepath" && rm "${filepath}.tmp"
    else
      mv "${filepath}.tmp" "$filepath"
    fi
    echo "       ✔ saved ($(wc -c < "$filepath") bytes, $(wc -l < "$filepath") rows)"
  else
    echo "       ✘ curl failed"
    rm -f "${filepath}.tmp"
    exit 1
  fi
  i=$((i + 1))
done

echo ""
echo "=== Done. Eyeball the periode shape ==="
echo "  grep -o '\"periode\":\"[^\"]*\"' ${OUTDIR}/*.json | head -5"
echo "  Expected: YYYY_NN (e.g. \"2025_12\")"