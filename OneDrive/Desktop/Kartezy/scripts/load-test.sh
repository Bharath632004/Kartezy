#!/bin/bash
# Kartezy Load Testing Script using k6
# Tests key API endpoints under concurrent load
# Usage: ./scripts/load-test.sh [base_url] [virtual_users] [duration]
# Example: ./scripts/load-test.sh http://localhost:8080 50 30s

BASE_URL="${1:-http://localhost:8080}"
VUS="${2:-50}"
DURATION="${3:-30s}"

echo "=========================================="
echo "  Kartezy Load Test Suite"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo "Virtual Users: $VUS"
echo "Duration: $DURATION"
echo "=========================================="

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo "WARNING: k6 not found. Install from https://k6.io/docs/get-started/installation/"
    echo "Falling back to Apache Bench (ab) if available..."
    
    if command -v ab &> /dev/null; then
        echo "Running ApacheBench (ab) load test..."
        ab -n 1000 -c $VUS "${BASE_URL}/api/health"
        ab -n 500 -c $VUS "${BASE_URL}/api/products?page=1&size=20"
        ab -n 500 -c $VUS "${BASE_URL}/api/categories"
    else
        echo "No load testing tool found. Please install k6 or ApacheBench (ab)."
        echo "Installing k6: https://k6.io/docs/get-started/installation/"
        exit 1
    fi
    exit 0
fi

# Run k6 load tests
k6 run --vus $VUS --duration $DURATION -e BASE_URL="$BASE_URL" - <<'EOF'
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const baseUrl = __ENV.BASE_URL;

const errorRate = new Rate('errors');
const apiResponseTime = new Trend('api_response_time');

// Test configuration thresholds
export const options = {
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% of requests must complete within 2s
        errors: ['rate<0.1'],               // Error rate must be below 10%
    },
};

export default function () {
    // Group 1: Health & Discovery
    group('Health & Discovery', function () {
        // Health check
        let res = http.get(`${baseUrl}/actuator/health`);
        check(res, { 'health endpoint responds with 200': (r) => r.status === 200 });
        apiResponseTime.add(res.timings.duration);
        sleep(0.5);

        // Products listing
        res = http.get(`${baseUrl}/api/products?page=0&size=20`);
        check(res, { 'products listing responds with 200': (r) => r.status === 200 });
        apiResponseTime.add(res.timings.duration);
        sleep(0.3);

        // Categories
        res = http.get(`${baseUrl}/api/categories`);
        check(res, { 'categories responds with 200': (r) => r.status === 200 });
        apiResponseTime.add(res.timings.duration);
        sleep(0.3);
    });

    // Group 2: Search & Catalog
    group('Search & Catalog', function () {
        // Search products
        res = http.get(`${baseUrl}/api/products/search?q=milk`);
        check(res, { 'search responds with 200': (r) => r.status === 200 });
        apiResponseTime.add(res.timings.duration);
        sleep(0.5);

        // Product detail
        res = http.get(`${baseUrl}/api/products/1`);
        check(res, { 'product detail responds with 200': (r) => r.status === 200 });
        apiResponseTime.add(res.timings.duration);
        sleep(0.3);

        // Nearby stores
        res = http.get(`${baseUrl}/api/merchants/stores/nearby?city=mumbai`);
        check(res, { 'nearby stores responds with 200': (r) => r.status === 200 });
        apiResponseTime.add(res.timings.duration);
        sleep(0.3);
    });

    // Group 3: Auth & User
    group('Auth & User', function () {
        // Login
        const loginPayload = JSON.stringify({
            email: 'test@kartezy.com',
            password: 'testpassword123'
        });
        res = http.post(`${baseUrl}/api/auth/login`, loginPayload, {
            headers: { 'Content-Type': 'application/json' },
        });
        check(res, { 'login responds with 200': (r) => r.status === 200 });
        errorRate.add(res.status !== 200);
        apiResponseTime.add(res.timings.duration);
        sleep(1);
    });

    // Group 4: Orders & Delivery
    group('Orders & Delivery', function () {
        // Getting available delivery partners
        res = http.get(`${baseUrl}/api/delivery/partners/available`);
        check(res, { 'available partners responds': (r) => r.status >= 200 && r.status < 500 });
        apiResponseTime.add(res.timings.duration);
        sleep(1);
    });

    // Group 5: Analytics
    group('Analytics', function () {
        // Analytics dashboard
        res = http.get(`${baseUrl}/api/analytics/dashboard`);
        check(res, { 'analytics dashboard responds': (r) => r.status >= 200 && r.status < 500 });
        apiResponseTime.add(res.timings.duration);
        sleep(0.5);
    });
}
EOF
