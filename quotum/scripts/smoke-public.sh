#!/usr/bin/env bash
# Smoke-test Quotum public publish surfaces.
# Usage: ./scripts/smoke-public.sh https://your-origin
set -euo pipefail

ORIGIN="${1:-}"
if [[ -z "$ORIGIN" ]]; then
  echo "Usage: $0 https://your-origin" >&2
  exit 1
fi

ORIGIN="${ORIGIN%/}"
fail=0

check() {
  local path="$1"
  local code
  code=$(curl -sS -o /tmp/quotum-smoke.body -w "%{http_code}" "$ORIGIN$path" || echo "000")
  if [[ "$code" == "200" ]]; then
    echo "OK  $code  $path"
  else
    echo "FAIL $code  $path" >&2
    fail=1
  fi
}

check "/"
check "/.well-known/answer-contracts.json"
check "/api/publish"
check "/api/publish/contracts/ac_analytics_best_for_startups"
check "/api/publish/contracts/ac_analytics_open_source_alt"
check "/answers/ac_analytics_best_for_startups"
check "/answers/ac_analytics_open_source_alt"
check "/pilot"
check "/api/pilot"
check "/sitemap.xml"
check "/robots.txt"

echo "--- discovery excerpt ---"
curl -sS "$ORIGIN/.well-known/answer-contracts.json" | head -c 500
echo
echo "--- robots ---"
curl -sS "$ORIGIN/robots.txt"
echo

# Fail if sitemap still points at localhost while ORIGIN is public
if [[ "$ORIGIN" != http://127.0.0.1* && "$ORIGIN" != http://localhost* ]]; then
  if curl -sS "$ORIGIN/sitemap.xml" | grep -q "127.0.0.1\|localhost"; then
    echo "FAIL sitemap still contains localhost — set PUBLIC_ORIGIN=$ORIGIN on the server" >&2
    fail=1
  else
    echo "OK  sitemap uses non-localhost URLs"
  fi
fi

exit "$fail"
