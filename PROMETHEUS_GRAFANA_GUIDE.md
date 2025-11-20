# Hướng dẫn Prometheus & Grafana cho Clothes Shop

## 📊 Tổng quan

Dự án đã được tích hợp Prometheus và Grafana để monitoring và visualization:

- **Prometheus**: Thu thập và lưu trữ metrics từ server
- **Grafana**: Hiển thị metrics trên dashboard trực quan
- **MongoDB Exporter**: Thu thập metrics từ MongoDB

## 🚀 Khởi động

### 1. Cài đặt dependencies mới

```bash
cd server_app
npm install
```

### 2. Khởi động tất cả services

```bash
docker compose up -d
```

Các services sẽ chạy trên:
- **Server App**: http://localhost:8000
- **Client App**: http://localhost:3000
- **Admin App**: http://localhost:3001
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3002
- **MongoDB**: localhost:27017

## 📈 Truy cập Prometheus

1. Mở browser: http://localhost:9090
2. Vào **Status → Targets** để xem trạng thái các services đang được monitor
3. Vào **Graph** để query và xem metrics

### Một số queries hữu ích:

```promql
# Tổng số HTTP requests
sum(http_requests_total)

# Request rate per second
rate(http_requests_total[5m])

# HTTP request duration (95th percentile)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# MongoDB connection status
mongodb_connection_status

# Memory usage
process_resident_memory_bytes / 1024 / 1024

# CPU usage
rate(process_cpu_seconds_total[5m])

# Active connections
active_connections
```

## 📊 Truy cập Grafana

### 1. Đăng nhập

- URL: http://localhost:3002
- Username: `admin`
- Password: `admin123`

### 2. Data Source đã được tự động cấu hình

Prometheus datasource đã được tự động thêm vào Grafana. Kiểm tra tại:
- Menu → Configuration → Data Sources → Prometheus

### 3. Tạo Dashboard

#### Cách 1: Import Dashboard có sẵn

1. Click **+ → Import**
2. Nhập ID dashboard từ Grafana.com:
   - **1860**: Node Exporter Full (cho system metrics)
   - **11159**: Prometheus Metrics
   - **2949**: Prometheus Stats
3. Chọn **Prometheus** làm data source
4. Click **Import**

#### Cách 2: Tạo Dashboard tùy chỉnh

1. Click **+ → Dashboard → Add new panel**
2. Chọn metric từ dropdown hoặc nhập query
3. Tùy chỉnh visualization (Graph, Gauge, Stat, etc.)
4. Click **Apply** và **Save dashboard**

### 4. Dashboard đề xuất cho Clothes Shop

Tạo dashboard với các panels sau:

#### Panel 1: Total HTTP Requests
- **Query**: `sum(http_requests_total)`
- **Visualization**: Stat
- **Title**: "Total Requests"

#### Panel 2: Request Rate
- **Query**: `sum(rate(http_requests_total[5m]))`
- **Visualization**: Graph
- **Title**: "Requests/sec (5m avg)"

#### Panel 3: Response Time (p95)
- **Query**: `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))`
- **Visualization**: Graph
- **Title**: "Response Time 95th Percentile"

#### Panel 4: Memory Usage
- **Query**: `process_resident_memory_bytes / 1024 / 1024`
- **Visualization**: Graph
- **Title**: "Memory Usage (MB)"

#### Panel 5: MongoDB Status
- **Query**: `mongodb_connection_status`
- **Visualization**: Stat
- **Title**: "MongoDB Status"
- **Thresholds**: 0 = Red, 1 = Green

#### Panel 6: Active Connections
- **Query**: `active_connections`
- **Visualization**: Graph
- **Title**: "Active Socket.IO Connections"

#### Panel 7: HTTP Status Codes
- **Query**: `sum by (status_code) (http_requests_total)`
- **Visualization**: Pie Chart
- **Title**: "HTTP Status Codes Distribution"

#### Panel 8: CPU Usage
- **Query**: `rate(process_cpu_seconds_total[5m]) * 100`
- **Visualization**: Gauge
- **Title**: "CPU Usage %"

## 🔍 Metrics được thu thập

### Application Metrics

1. **http_requests_total**: Tổng số HTTP requests
   - Labels: method, route, status_code

2. **http_request_duration_seconds**: Thời gian xử lý requests
   - Labels: method, route, status_code

3. **active_connections**: Số lượng Socket.IO connections đang active

4. **mongodb_connection_status**: Trạng thái kết nối MongoDB (0/1)

### System Metrics (Default)

- **process_cpu_seconds_total**: CPU usage
- **process_resident_memory_bytes**: Memory usage
- **nodejs_heap_size_total_bytes**: Node.js heap size
- **nodejs_heap_size_used_bytes**: Heap memory used
- **nodejs_eventloop_lag_seconds**: Event loop lag

### MongoDB Metrics (từ exporter)

- **mongodb_up**: MongoDB availability
- **mongodb_connections**: Number of connections
- **mongodb_memory**: Memory usage
- **mongodb_network**: Network I/O

## 🎯 Use Cases

### 1. Monitor Performance
- Theo dõi response time để phát hiện bottlenecks
- Xem memory/CPU để phát hiện memory leaks

### 2. Track User Activity
- Đếm số requests để biết traffic
- Xem active connections để biết số users online

### 3. Debug Issues
- Xem HTTP status codes để tìm errors (4xx, 5xx)
- Monitor MongoDB status để phát hiện database issues

### 4. Capacity Planning
- Theo dõi resource usage để quyết định scale
- Phân tích traffic patterns

## 🔧 Alerting (Tùy chọn)

### Tạo Alert trong Grafana

1. Vào panel cần alert
2. Click **Alert** tab
3. Tạo alert rule:

**Ví dụ**: Alert khi response time > 1s
```
Query: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
Condition: WHEN avg() OF query(A, 5m, now) IS ABOVE 1
```

4. Configure notification channels (Email, Slack, etc.)

## 🐛 Troubleshooting

### Prometheus không thu thập được metrics

1. Kiểm tra server app có chạy: `docker ps`
2. Kiểm tra endpoint metrics: http://localhost:8000/metrics
3. Xem Prometheus targets: http://localhost:9090/targets
4. Kiểm tra logs: `docker logs prometheus`

### Grafana không kết nối được Prometheus

1. Kiểm tra datasource configuration
2. Test connection trong Settings → Data Sources
3. Đảm bảo Prometheus URL là: `http://prometheus:9090`
4. Kiểm tra logs: `docker logs grafana`

### MongoDB Exporter không hoạt động

1. Kiểm tra MongoDB có chạy: `docker ps | grep mongo`
2. Test connection: http://localhost:9216/metrics
3. Kiểm tra logs: `docker logs mongodb-exporter`

## 📚 Tài liệu tham khảo

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prom-client (Node.js)](https://github.com/siimon/prom-client)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)

## 🎓 Mẹo hay

1. **Sử dụng Variables**: Tạo variables trong Grafana để filter theo environment, service, etc.
2. **Set Time Range**: Điều chỉnh time range phù hợp (Last 5m, 1h, 24h)
3. **Create Alerts**: Setup alerts cho các metrics quan trọng
4. **Export Dashboard**: Save dashboard dưới dạng JSON để backup
5. **Use Tags**: Tag các dashboard để dễ tìm kiếm
6. **Create Playlists**: Tạo playlist để rotate giữa các dashboards

## 📧 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Logs của các containers: `docker logs <container_name>`
2. Network connectivity: `docker network inspect sgu25_doan_ktpm_default`
3. Ports không bị conflict với ứng dụng khác

---

**Happy Monitoring! 📊✨**
