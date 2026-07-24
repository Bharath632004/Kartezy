// ============================================================
// Kartezy Enterprise Load Test — k6 Script
// ============================================================
// Run: k6 run --vus 50 --duration 5m k6-load-test.js
// ============================================================

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ======== Custom Metrics ========
const errorRate = new Rate('errors');
const orderLatency = new Trend('order_latency_ms');
const searchLatency = new Trend('search_latency_ms');
const loginLatency = new Trend('login_latency_ms');
const paymentLatency = new Trend('payment_latency_ms');

// ======== Configuration ========
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';
const JWT_SECRET = __ENV.JWT_SECRET || 'test-secret';

// Staged ramp-up for realistic traffic patterns
export const options = {
    stages: [
        { duration: '1m', target: 20 },   // Ramp up to 20 users
        { duration: '3m', target: 50 },   // Ramp to 50 users
        { duration: '2m', target: 100 },  // Peak load
        { duration: '2m', target: 50 },   // Scale down
        { duration: '1m', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],  // 95% of requests < 2s
        http_req_failed: ['rate<0.05'],     // < 5% failure rate
        errors: ['rate<0.05'],              // < 5% custom errors
        order_latency_ms: ['p(95)<3000'],   // Order API < 3s p95
        search_latency_ms: ['p(95)<1000'],  // Search < 1s p95
        login_latency_ms: ['p(95)<2000'],   // Login < 2s p95
    },
};

// ======== Helper Functions ========

function randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getHeaders(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
        'X-Device-ID': `load-test-${__VU}`,
    };
}

// ======== Main Test Flow ========

export default function () {
    group('Authentication Flow', function () {
        // Login with test credentials
        const loginStart = Date.now();
        const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
            email: `user${__VU}@test.com`,
            password: 'Test@Password123'
        }), { headers: getHeaders() });

        loginLatency.add(Date.now() - loginStart);
        check(loginRes, {
            'login successful': (r) => r.status === 200,
            'has access token': (r) => r.json('accessToken') !== undefined,
        });
        errorRate.add(loginRes.status !== 200);

        if (loginRes.status === 200) {
            const token = loginRes.json('accessToken');

            // Browse categories
            group('Browse Catalog', function () {
                // Get categories (cached)
                const catRes = http.get(`${BASE_URL}/categories`, {
                    headers: getHeaders(token)
                });
                check(catRes, {
                    'categories fetched': (r) => r.status === 200,
                });

                // Search products
                const searchStart = Date.now();
                const searchRes = http.get(
                    `${BASE_URL}/catalog/search?q=${randomString(3)}&page=0&size=20`,
                    { headers: getHeaders(token) }
                );
                searchLatency.add(Date.now() - searchStart);
                check(searchRes, {
                    'search completed': (r) => r.status === 200,
                });
                errorRate.add(searchRes.status !== 200);
            });

            // Browse stores
            group('Browse Stores', function () {
                const storesRes = http.get(`${BASE_URL}/merchants/nearby?lat=12.9716&lng=77.5946`, {
                    headers: getHeaders(token)
                });
                check(storesRes, {
                    'stores fetched': (r) => r.status === 200,
                });
            });

            // View products
            group('View Products', function () {
                const productsRes = http.get(`${BASE_URL}/catalog/products?page=0&size=10`, {
                    headers: getHeaders(token)
                });
                check(productsRes, {
                    'products fetched': (r) => r.status === 200,
                });
            });

            // Place order (for some virtual users)
            if (__VU % 3 === 0) {
                group('Place Order', function () {
                    const orderStart = Date.now();
                    const orderRes = http.post(`${BASE_URL}/orders`, JSON.stringify({
                        items: [{ productId: 'p1', quantity: 2 }],
                        deliveryAddress: '123 Test St, Bangalore',
                        paymentMethod: 'COD'
                    }), { headers: getHeaders(token) });

                    orderLatency.add(Date.now() - orderStart);
                    check(orderRes, {
                        'order placed': (r) => r.status === 200 || r.status === 201,
                    });
                    errorRate.add(orderRes.status !== 200 && orderRes.status !== 201);
                });
            }

            // Check wallet (for some users)
            if (__VU % 4 === 0) {
                const walletRes = http.get(`${BASE_URL}/wallet/balance`, {
                    headers: getHeaders(token)
                });
                check(walletRes, {
                    'wallet fetched': (r) => r.status === 200,
                });
            }
        }
    });

    // Random think time (100ms - 3s)
    sleep(Math.random() * 3 + 0.1);
}

// ======== Setup / Teardown ========

export function setup() {
    console.log(`Starting load test against ${BASE_URL}`);
    console.log(`Virtual users: ${__VU}`);
    return { startTime: Date.now() };
}

export function teardown(data) {
    const duration = (Date.now() - data.startTime) / 1000;
    console.log(`Load test completed in ${duration}s`);
}
