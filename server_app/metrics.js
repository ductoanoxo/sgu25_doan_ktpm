// Prometheus Metrics Configuration
const promClient = require('prom-client');

// Tạo registry riêng
const register = new promClient.Registry();

// Collect default metrics (CPU, Memory, Event Loop, etc.)
promClient.collectDefaultMetrics({ 
    register,
    prefix: 'nodejs_',
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5]
});

// ============= HTTP METRICS =============

// HTTP Request Duration Histogram
const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    registers: [register]
});

// HTTP Request Total Counter
const httpRequestTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
});

// HTTP Error Counter
const httpErrorsTotal = new promClient.Counter({
    name: 'http_errors_total',
    help: 'Total number of HTTP errors',
    labelNames: ['method', 'route', 'status_code', 'error_type'],
    registers: [register]
});

// ============= DATABASE METRICS =============

// MongoDB Connection Status
const mongodbConnectionStatus = new promClient.Gauge({
    name: 'mongodb_connection_status',
    help: 'MongoDB connection status (1 = connected, 0 = disconnected)',
    registers: [register]
});

// MongoDB Query Duration
const mongodbQueryDuration = new promClient.Histogram({
    name: 'mongodb_query_duration_seconds',
    help: 'Duration of MongoDB queries in seconds',
    labelNames: ['operation', 'collection'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [register]
});

// MongoDB Operations Counter
const mongodbOperationsTotal = new promClient.Counter({
    name: 'mongodb_operations_total',
    help: 'Total number of MongoDB operations',
    labelNames: ['operation', 'collection', 'status'],
    registers: [register]
});

// ============= WEBSOCKET METRICS =============

// Active Socket.IO Connections
const activeConnections = new promClient.Gauge({
    name: 'socketio_active_connections',
    help: 'Number of active Socket.IO connections',
    registers: [register]
});

// Socket.IO Events Counter
const socketioEventsTotal = new promClient.Counter({
    name: 'socketio_events_total',
    help: 'Total number of Socket.IO events',
    labelNames: ['event_type', 'direction'],
    registers: [register]
});

// ============= BUSINESS METRICS =============

// Orders Counter
const ordersTotal = new promClient.Counter({
    name: 'orders_total',
    help: 'Total number of orders',
    labelNames: ['status', 'payment_method'],
    registers: [register]
});

// Order Value Summary
const orderValue = new promClient.Summary({
    name: 'order_value_vnd',
    help: 'Order values in VND',
    labelNames: ['status'],
    percentiles: [0.5, 0.9, 0.95, 0.99],
    registers: [register]
});

// Products Viewed Counter
const productsViewed = new promClient.Counter({
    name: 'products_viewed_total',
    help: 'Total number of product views',
    labelNames: ['product_id', 'category'],
    registers: [register]
});

// User Registrations Counter
const userRegistrations = new promClient.Counter({
    name: 'user_registrations_total',
    help: 'Total number of user registrations',
    labelNames: ['gender'],
    registers: [register]
});

// User Logins Counter
const userLogins = new promClient.Counter({
    name: 'user_logins_total',
    help: 'Total number of user logins',
    labelNames: ['status'],
    registers: [register]
});

// Cart Operations Counter
const cartOperations = new promClient.Counter({
    name: 'cart_operations_total',
    help: 'Total number of cart operations',
    labelNames: ['operation'],
    registers: [register]
});

// ============= PAYMENT METRICS =============

// Payment Transactions Counter
const paymentTransactions = new promClient.Counter({
    name: 'payment_transactions_total',
    help: 'Total number of payment transactions',
    labelNames: ['provider', 'status'],
    registers: [register]
});

// Payment Amount Summary
const paymentAmount = new promClient.Summary({
    name: 'payment_amount_vnd',
    help: 'Payment amounts in VND',
    labelNames: ['provider', 'status'],
    percentiles: [0.5, 0.9, 0.95, 0.99],
    registers: [register]
});

// ============= UPLOAD METRICS =============

// File Uploads Counter
const fileUploads = new promClient.Counter({
    name: 'file_uploads_total',
    help: 'Total number of file uploads',
    labelNames: ['service', 'status'],
    registers: [register]
});

// Upload Size Summary
const uploadSize = new promClient.Summary({
    name: 'upload_size_bytes',
    help: 'Size of uploaded files in bytes',
    labelNames: ['service'],
    percentiles: [0.5, 0.9, 0.95, 0.99],
    registers: [register]
});

// ============= CACHE METRICS =============

// Cache Hits/Misses Counter
const cacheOperations = new promClient.Counter({
    name: 'cache_operations_total',
    help: 'Total number of cache operations',
    labelNames: ['operation', 'result'],
    registers: [register]
});

// ============= EXPORT =============

module.exports = {
    register,
    metrics: {
        // HTTP
        httpRequestDuration,
        httpRequestTotal,
        httpErrorsTotal,
        
        // Database
        mongodbConnectionStatus,
        mongodbQueryDuration,
        mongodbOperationsTotal,
        
        // WebSocket
        activeConnections,
        socketioEventsTotal,
        
        // Business
        ordersTotal,
        orderValue,
        productsViewed,
        userRegistrations,
        userLogins,
        cartOperations,
        
        // Payment
        paymentTransactions,
        paymentAmount,
        
        // Upload
        fileUploads,
        uploadSize,
        
        // Cache
        cacheOperations
    }
};
