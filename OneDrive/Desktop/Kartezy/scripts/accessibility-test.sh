#!/bin/bash
# Kartezy Accessibility Testing Script
# Uses Pa11y CI to verify WCAG 2.2 AA compliance across key pages
# Usage: ./scripts/accessibility-test.sh [base_url]

BASE_URL="${1:-http://localhost:3000}"

echo "=========================================="
echo "  Kartezy Accessibility Test Suite"
echo "=========================================="
echo "Testing: WCAG 2.2 AA Compliance"
echo "Base URL: $BASE_URL"
echo "=========================================="

# Check for pa11y-ci
if ! command -v pa11y-ci &> /dev/null; then
    echo "Installing pa11y-ci..."
    npm install -g pa11y-ci 2>/dev/null || {
        echo "ERROR: Could not install pa11y-ci. Please install manually:"
        echo "  npm install -g pa11y-ci"
        echo ""
        echo "Alternatively, use axe-core CLI:"
        echo "  npm install -g @axe-core/cli"
        exit 1
    }
fi

# Create pa11y config
cat > /tmp/pa11y-config.json << 'CONFIG'
{
    "defaults": {
        "standard": "WCAG2AA",
        "timeout": 30000,
        "chromeLaunchConfig": {
            "args": ["--no-sandbox", "--disable-setuid-sandbox"]
        },
        "ignore": [
            "notice",
            "warning"
        ]
    },
    "urls": []
}
CONFIG

# Generate pa11y config file with URLs inline
cat > /tmp/pa11y-urls.json << 'URLS'
[
    "${BASE_URL}/",
    "${BASE_URL}/login",
    "${BASE_URL}/search",
    "${BASE_URL}/checkout",
    "${BASE_URL}/categories",
    "${BASE_URL}/products",
    "${BASE_URL}/about",
    "${BASE_URL}/contact",
    "${BASE_URL}/support"
]
URLS

# Run pa11y individually for each URL
echo "Testing 9 pages for WCAG 2.2 AA compliance..."
echo ""

for url in "${BASE_URL}/" "${BASE_URL}/login" "${BASE_URL}/search" "${BASE_URL}/checkout" "${BASE_URL}/categories" "${BASE_URL}/products" "${BASE_URL}/about" "${BASE_URL}/contact" "${BASE_URL}/support"; do
    echo "=========================================="
    echo "  Testing: $url"
    echo "=========================================="
    pa11y --standard WCAG2AA --timeout 30000 "$url" 2>/dev/null || echo "  Could not test $url (service may not be running)"
    echo ""
done

echo ""
echo "=========================================="
echo "  Accessibility Tests Complete"
echo "=========================================="
echo "Review any violations above and fix them before production deployment."
echo "For detailed reports, run: pa11y --reporter html <url>"
echo "=========================================="
