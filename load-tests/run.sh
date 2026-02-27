#!/usr/bin/env bash
# =============================================================================
# Loterias Load Test Runner
# Usage: ./run.sh [suite] [profile]
#
# Suites:   all | dashboard | estatisticas | analise | concursos | misc | frontend | journey
# Profiles: smoke | light | standard | stress | spike
#
# Examples:
#   ./run.sh                          # Run all suites with 'light' profile
#   ./run.sh dashboard smoke          # Smoke test dashboard endpoints
#   ./run.sh all standard             # Standard load test all suites
#   ./run.sh journey stress           # Stress test user journey
#
# Environment variables:
#   BACKEND_URL   (default: http://localhost:8082)
#   FRONTEND_URL  (default: http://localhost:3000)
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SUITE="${1:-all}"
PROFILE="${2:-light}"
RESULTS_DIR="${SCRIPT_DIR}/results"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

mkdir -p "${RESULTS_DIR}"

SUITES=(dashboard estatisticas analise concursos misc-endpoints frontend user-journey)

run_suite() {
  local name="$1"
  local file="${SCRIPT_DIR}/${name}.test.js"
  local out="${RESULTS_DIR}/${TIMESTAMP}_${name}_${PROFILE}"

  if [[ ! -f "$file" ]]; then
    echo "⚠  Test file not found: ${file}"
    return 1
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶  Running: ${name} (${PROFILE})"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  k6 run \
    --env PROFILE="${PROFILE}" \
    --env BACKEND_URL="${BACKEND_URL:-http://localhost:8082}" \
    --env FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}" \
    --summary-export="${out}.json" \
    --out "json=${out}_raw.json" \
    "${file}" 2>&1 | tee "${out}.log"

  echo "✓  Results: ${out}.json"
}

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║            Loterias Load Test Suite                            ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║  Suite:    ${SUITE}$(printf '%*s' $((46 - ${#SUITE})) '')║"
echo "║  Profile:  ${PROFILE}$(printf '%*s' $((46 - ${#PROFILE})) '')║"
echo "║  Backend:  ${BACKEND_URL:-http://localhost:8082}$(printf '%*s' $((46 - ${#BACKEND_URL:-http://localhost:8082})) '')║"
echo "║  Frontend: ${FRONTEND_URL:-http://localhost:3000}$(printf '%*s' $((46 - ${#FRONTEND_URL:-http://localhost:3000})) '')║"
echo "╚══════════════════════════════════════════════════════════════════╝"

# Preflight connectivity check
echo ""
echo "🔍 Connectivity check..."
BACKEND_URL="${BACKEND_URL:-http://localhost:8082}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
if curl -s -o /dev/null -w "" --connect-timeout 3 "${BACKEND_URL}/"; then
  echo "  ✓ Backend reachable at ${BACKEND_URL}"
else
  echo "  ✗ Backend unreachable at ${BACKEND_URL}" >&2
  exit 1
fi
if curl -s -o /dev/null -w "" --connect-timeout 3 "${FRONTEND_URL}/"; then
  echo "  ✓ Frontend reachable at ${FRONTEND_URL}"
else
  echo "  ✗ Frontend unreachable at ${FRONTEND_URL}" >&2
  exit 1
fi
echo ""

FAILED=0
if [[ "$SUITE" == "all" ]]; then
  for s in "${SUITES[@]}"; do
    run_suite "$s" || FAILED=$((FAILED + 1))
  done
else
  run_suite "$SUITE" || FAILED=$((FAILED + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ $FAILED -eq 0 ]]; then
  echo "✅ All test suites completed successfully"
else
  echo "⚠  ${FAILED} suite(s) had failures"
fi
echo "📁 Results directory: ${RESULTS_DIR}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
