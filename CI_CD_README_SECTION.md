## 🧪 CI/CD & Testing

Repository này đã được thiết lập với hệ thống CI/CD hoàn chỉnh sử dụng **GitHub Actions**, bao gồm:

- ✅ **Unit Tests** - Kiểm thử từng component riêng lẻ
- ✅ **Integration Tests** - Kiểm thử tích hợp API và database
- ✅ **E2E Tests** - Kiểm thử end-to-end toàn bộ hệ thống
- ✅ **Code Coverage** - Đo lường độ phủ code (target 70-80%)
- ✅ **Auto Deployment** - Tự động deploy khi merge vào main

### 📊 Test Statistics

- **90+ Test Cases** across all applications
- **Server**: 40+ unit tests, 50+ integration tests
- **Client**: 25+ component tests, 6+ API tests
- **Admin**: 4+ component tests

### 🚀 Quick Start

```bash
# Cài đặt dependencies
cd server_app && npm install && cd ..
cd client_app && npm install && cd ..
cd admin_app && npm install && cd ..

# Chạy tất cả tests
./run-all-tests.sh        # Linux/macOS
run-all-tests.bat         # Windows
```

### 📝 Test Commands

**Server:**
```bash
cd server_app
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:coverage      # With coverage report
```

**Client/Admin:**
```bash
cd client_app  # or admin_app
npm test                   # Interactive mode
npm run test:coverage     # Coverage report
npm run test:ci          # CI mode
```

### 📚 Documentation

- [**QUICK_START.md**](./QUICK_START.md) - Quick reference và commands
- [**CI_CD_TESTING_GUIDE.md**](./CI_CD_TESTING_GUIDE.md) - Hướng dẫn đầy đủ về CI/CD
- [**SETUP_TESTING_GUIDE.md**](./SETUP_TESTING_GUIDE.md) - Cài đặt và troubleshooting
- [**IMPLEMENTATION_SUMMARY.md**](./IMPLEMENTATION_SUMMARY.md) - Tóm tắt implementation

### 🔄 CI/CD Pipeline

Pipeline tự động chạy khi push code hoặc tạo Pull Request:

1. **Tests** - Chạy tất cả unit và integration tests
2. **Linting** - Kiểm tra code quality
3. **Coverage** - Đo lường test coverage
4. **Build** - Build Docker images
5. **Deploy** - Auto deploy (main branch only)

Xem workflow tại: `.github/workflows/ci-cd.yml`

### 🎯 Coverage Goals

| Component | Target |
|-----------|--------|
| Server    | 80%    |
| Client    | 70%    |
| Admin     | 70%    |

---

**Powered by Jest, React Testing Library, Supertest & GitHub Actions**
