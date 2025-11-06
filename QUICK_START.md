# Quick Start Guide - CI/CD & Testing

## 🚀 Quick Setup (5 phút)

### 1. Cài đặt dependencies

```bash
# Server
cd server_app && npm install && cd ..

# Client  
cd client_app && npm install && cd ..

# Admin
cd admin_app && npm install && cd ..
```

### 2. Chạy tests

**Windows:**
```bash
run-all-tests.bat
```

**Linux/macOS:**
```bash
chmod +x run-all-tests.sh
./run-all-tests.sh
```

### 3. Push lên GitHub

```bash
git add .
git commit -m "Add CI/CD with comprehensive tests"
git push origin kiet
```

**Lưu ý:** CI/CD sử dụng **GitHub Container Registry (GHCR)** - không cần setup Docker Hub!

## 📊 Test Commands Cheat Sheet

### Server
```bash
npm test              # Chạy tất cả tests
npm run test:unit     # Chỉ unit tests
npm run test:integration  # Chỉ integration tests
npm run test:coverage # Với coverage report
```

### Client/Admin
```bash
npm test              # Interactive mode
npm run test:coverage # Coverage report
npm run test:ci       # CI mode (no watch)
```

## ✅ Test Coverage Hiện Tại

### Server (Backend)
- ✅ User Model (Create, Update, Validation)
- ✅ Product Model (CRUD, Stock management)
- ✅ Order Model (Status flow, Calculations)
- ✅ User API (Register, Login, Profile)
- ✅ Product API (CRUD, Search, Filter)
- ✅ Order API (Create, Update, Statistics)

### Client (Frontend)
- ✅ SignIn Component
- ✅ SignUp Component
- ✅ Cart Component (Add, Remove, Update)
- ✅ Product API Integration

### Admin
- ✅ Admin Login Component

## 🔧 GitHub Actions

Workflow tự động chạy khi:
- Push lên `main`, `develop`, `kiet`
- Tạo Pull Request

Pipeline includes:
1. ✅ Server unit & integration tests
2. ✅ Client tests
3. ✅ Admin tests
4. ✅ Code linting
5. ✅ Docker builds
6. ✅ Auto deployment (main branch only)

## 📝 Next Steps

1. [ ] Chạy `npm install` cho tất cả apps
2. [ ] Chạy tests locally: `./run-all-tests.sh`
3. [ ] Fix any failing tests
4. [ ] ~~Setup GitHub Secrets~~ ✅ Không cần - dùng GHCR!
5. [ ] Push code và verify CI/CD
6. [ ] Viết thêm tests cho features mới
7. [ ] Check Docker images tại GitHub Packages

## 🐛 Common Issues

**MongoDB not running?**
```bash
# Linux/macOS
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Port already in use?**
```bash
# Kill process
lsof -ti:8000 | xargs kill  # Server
lsof -ti:3000 | xargs kill  # Client
```

**Tests timeout?**
Increase timeout in `jest.config.js`:
```javascript
testTimeout: 30000
```

## 📚 Documentation

- Đọc đầy đủ: `CI_CD_TESTING_GUIDE.md`
- Setup chi tiết: `SETUP_TESTING_GUIDE.md`

## 🎯 Coverage Goals

| Component | Current | Target |
|-----------|---------|--------|
| Server    | 60%+    | 80%    |
| Client    | 50%+    | 70%    |
| Admin     | 40%+    | 70%    |

## 💡 Tips

- Chạy test cụ thể: `npm test -- user.test.js`
- Watch mode: `npm test -- --watch`
- Debug: `node --inspect-brk node_modules/.bin/jest --runInBand`
- Update snapshots: `npm test -- -u`

---

**Happy Testing! 🎉**
