# Hướng Dẫn Cài Đặt và Chạy Tests

## Bước 1: Cài Đặt Dependencies

### Server App (Backend)

```bash
cd server_app
npm install
```

Dependencies mới đã được thêm:
- `jest`: Test framework
- `supertest`: API testing
- `mongodb-memory-server`: In-memory MongoDB cho tests
- `eslint`: Code linting

### Client App (Frontend)

```bash
cd client_app
npm install
```

Dependencies mới đã được thêm:
- `redux-mock-store`: Mock Redux store cho tests

### Admin App

```bash
cd admin_app
npm install
```

## Bước 2: Cấu Hình Environment

### Server (.env file)

Tạo file `server_app/.env`:

```env
MONGO_URL=mongodb://localhost:27017/Clothes
JWT_SECRET=your_secret_key_here
NODE_ENV=development

# For testing
MONGO_URL_TEST=mongodb://localhost:27017/Clothes_Test
```

## Bước 3: Chạy Tests

### Server Tests

```bash
cd server_app

# Chạy tất cả tests
npm test

# Chỉ chạy unit tests
npm run test:unit

# Chỉ chạy integration tests
npm run test:integration

# Chạy tests với coverage report
npm run test:coverage

# Chạy tests ở watch mode (tự động re-run khi có thay đổi)
npm run test:watch
```

### Client Tests

```bash
cd client_app

# Chạy tests (interactive watch mode)
npm test

# Chạy tests một lần với coverage
npm run test:coverage

# Chạy tests cho CI/CD
npm run test:ci
```

### Admin Tests

```bash
cd admin_app

# Chạy tests
npm test

# Coverage report
npm run test:coverage

# CI mode
npm run test:ci
```

## Bước 4: Code Linting

### Server

```bash
cd server_app

# Check linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Client & Admin

React apps đã có ESLint tích hợp sẵn trong `react-scripts`.

## Bước 5: Chạy Toàn Bộ Ứng Dụng với Docker

```bash
# Build và start tất cả services
docker-compose up --build

# Chỉ start database
docker-compose up -d mongo

# Chạy tests trong Docker
docker-compose run server_app npm test
docker-compose run client_app npm test
docker-compose run admin_app npm test
```

## Bước 6: Thiết Lập GitHub Actions

1. **Fork hoặc clone repository**

2. **~~Thêm GitHub Secrets~~** - **KHÔNG CẦN!**
   - ✅ Pipeline sử dụng GitHub Container Registry (GHCR)
   - ✅ Tự động authenticate bằng `GITHUB_TOKEN`
   - ✅ Không cần Docker Hub account

3. **Push code lên GitHub**:

```bash
git add .
git commit -m "Add CI/CD with tests"
git push origin kiet
```

4. **Xem kết quả trong GitHub Actions**:
   - Vào tab "Actions" trên GitHub repository
   - Xem workflow "CI/CD Pipeline" đang chạy
   - Docker images sẽ tự động push lên GitHub Packages (GHCR)

## Cấu Trúc Tests Đã Tạo

```
server_app/
├── jest.config.js                          # Jest configuration
├── tests/
│   ├── setup.js                           # Test setup với MongoDB in-memory
│   ├── unit/
│   │   └── models/
│   │       ├── user.test.js              # User model tests
│   │       ├── product.test.js           # Product model tests
│   │       └── order.test.js             # Order model tests
│   └── integration/
│       └── api/
│           ├── user.test.js              # User API tests
│           ├── product.test.js           # Product API tests
│           └── order.test.js             # Order API tests

client_app/
└── src/
    ├── setupTests.js                      # Test setup
    └── __tests__/
        ├── Auth/
        │   ├── SignIn.test.js            # Login component tests
        │   └── SignUp.test.js            # Register component tests
        ├── Cart/
        │   └── Cart.test.js              # Cart component tests
        └── API/
            └── Product.test.js           # Product API tests

admin_app/
└── src/
    ├── setupTests.js                      # Test setup
    └── __tests__/
        └── component/
            └── Login/
                └── Login.test.js         # Admin login tests
```

## Test Coverage

### Xem Coverage Reports

Sau khi chạy `npm run test:coverage`, xem reports tại:

- **Server**: `server_app/coverage/lcov-report/index.html`
- **Client**: `client_app/coverage/lcov-report/index.html`
- **Admin**: `admin_app/coverage/lcov-report/index.html`

Mở file HTML trong browser để xem chi tiết.

## Troubleshooting

### Lỗi MongoDB Connection

```bash
# Kiểm tra MongoDB đang chạy
mongosh --eval "db.runCommand({ ping: 1 })"

# Start MongoDB
# Linux/macOS
sudo systemctl start mongod
# hoặc
brew services start mongodb-community

# Windows
net start MongoDB
```

### Lỗi Port Đã Được Sử Dụng

```bash
# Kill process trên port
# Linux/macOS
lsof -ti:8000 | xargs kill

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Tests Timeout

Tăng timeout trong `jest.config.js`:

```javascript
testTimeout: 30000  // 30 giây
```

### MongoDB Memory Server Issues

Nếu gặp lỗi với `mongodb-memory-server`, thử:

```bash
# Clear cache
rm -rf ~/.cache/mongodb-memory-server

# Re-download
cd server_app
npm rebuild mongodb-memory-server
```

### Module Not Found

```bash
# Clear node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

## Mẹo Viết Tests

### 1. Test một component cụ thể

```bash
# Server
npm test -- user.test.js

# Client/Admin
npm test -- SignIn.test
```

### 2. Update snapshots

```bash
npm test -- -u
```

### 3. Run tests in debug mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### 4. Watch specific files

```bash
npm test -- --watch --testPathPattern=user
```

## CI/CD Pipeline Flow

1. **Push code** → GitHub
2. **GitHub Actions** trigger
3. **Run tests** (unit + integration)
4. **Check coverage**
5. **Lint code**
6. **Build Docker images**
7. **Deploy** (if on main branch)

## Next Steps

1. ✅ Cài đặt dependencies
2. ✅ Chạy tests locally
3. ✅ Fix any failing tests
4. ✅ Push to GitHub
5. ✅ Verify CI/CD pipeline
6. ✅ Monitor coverage reports
7. ✅ Write more tests khi thêm features mới

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [GitHub Actions](https://docs.github.com/en/actions)

## Support

Nếu gặp vấn đề, tạo issue trên GitHub hoặc liên hệ team.
