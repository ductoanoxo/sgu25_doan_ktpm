// Middleware để track business metrics
const { metrics } = require('../metrics');

// Middleware track user login
const trackUserLogin = (status) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function(data) {
            try {
                const response = typeof data === 'string' ? JSON.parse(data) : data;
                if (response.token || response.success) {
                    metrics.userLogins.labels('success').inc();
                } else {
                    metrics.userLogins.labels('failed').inc();
                }
            } catch (err) {
                // Silent fail
            }
            originalSend.call(this, data);
        };
        next();
    };
};

// Middleware track user registration
const trackUserRegistration = (req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
        try {
            const response = typeof data === 'string' ? JSON.parse(data) : data;
            if (res.statusCode === 200 && req.body.gender) {
                metrics.userRegistrations.labels(req.body.gender).inc();
            }
        } catch (err) {
            // Silent fail
        }
        originalSend.call(this, data);
    };
    next();
};

// Middleware track order creation
const trackOrderCreation = (req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
        try {
            const response = typeof data === 'string' ? JSON.parse(data) : data;
            if (res.statusCode === 200 && req.body.total) {
                const paymentMethod = req.body.id_payment || 'unknown';
                const status = req.body.status || 'pending';
                
                metrics.ordersTotal.labels(status, paymentMethod).inc();
                metrics.orderValue.labels(status).observe(parseFloat(req.body.total));
            }
        } catch (err) {
            // Silent fail
        }
        originalSend.call(this, data);
    };
    next();
};

// Middleware track product view
const trackProductView = (req, res, next) => {
    try {
        if (req.params.id || req.query.id) {
            const productId = req.params.id || req.query.id;
            const category = req.query.category || 'unknown';
            metrics.productsViewed.labels(productId, category).inc();
        }
    } catch (err) {
        // Silent fail
    }
    next();
};

// Middleware track cart operations
const trackCartOperation = (operation) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function(data) {
            try {
                if (res.statusCode === 200) {
                    metrics.cartOperations.labels(operation).inc();
                }
            } catch (err) {
                // Silent fail
            }
            originalSend.call(this, data);
        };
        next();
    };
};

// Middleware track payment
const trackPayment = (provider) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function(data) {
            try {
                const response = typeof data === 'string' ? JSON.parse(data) : data;
                const status = res.statusCode === 200 ? 'success' : 'failed';
                const amount = req.body.amount || req.body.total || 0;
                
                metrics.paymentTransactions.labels(provider, status).inc();
                if (amount > 0) {
                    metrics.paymentAmount.labels(provider, status).observe(parseFloat(amount));
                }
            } catch (err) {
                // Silent fail
            }
            originalSend.call(this, data);
        };
        next();
    };
};

// Middleware track file upload
const trackFileUpload = (service) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function(data) {
            try {
                const status = res.statusCode === 200 ? 'success' : 'failed';
                metrics.fileUploads.labels(service, status).inc();
                
                if (req.files && status === 'success') {
                    const files = Array.isArray(req.files) ? req.files : Object.values(req.files);
                    files.forEach(file => {
                        const size = file.size || file.bytes || 0;
                        if (size > 0) {
                            metrics.uploadSize.labels(service).observe(size);
                        }
                    });
                }
            } catch (err) {
                // Silent fail
            }
            originalSend.call(this, data);
        };
        next();
    };
};

// Middleware track MongoDB operations
const trackMongoOperation = (operation, collection) => {
    return async (req, res, next) => {
        const start = Date.now();
        try {
            await next();
            const duration = (Date.now() - start) / 1000;
            metrics.mongodbQueryDuration.labels(operation, collection).observe(duration);
            metrics.mongodbOperationsTotal.labels(operation, collection, 'success').inc();
        } catch (err) {
            const duration = (Date.now() - start) / 1000;
            metrics.mongodbQueryDuration.labels(operation, collection).observe(duration);
            metrics.mongodbOperationsTotal.labels(operation, collection, 'failed').inc();
            throw err;
        }
    };
};

module.exports = {
    trackUserLogin,
    trackUserRegistration,
    trackOrderCreation,
    trackProductView,
    trackCartOperation,
    trackPayment,
    trackFileUpload,
    trackMongoOperation
};
