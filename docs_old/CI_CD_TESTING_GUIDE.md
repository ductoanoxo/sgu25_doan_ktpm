# CI/CD Pipeline với Unit Tests và Integration Tests

## Tổng quan

Repository này được cấu hình với hệ thống CI/CD hoàn chỉnh sử dụng GitHub Actions, bao gồm:

- ✅ **Unit Tests** - Kiểm thử từng thành phần riêng lẻ
- ✅ **Integration Tests** - Kiểm thử tích hợp giữa các module
- ✅ **Code Coverage** - Đo lường độ phủ code
- ✅ **Linting** - Kiểm tra chất lượng code
- ✅ **E2E Tests** - Kiểm thử end-to-end
- ✅ **Docker Build** - Build và push Docker images
- ✅ **Auto Deploy** - Tự động triển khai

## Cấu trúc Dự án

```
sgu25_doan_ktpm/
├── server_app/          # Backend API (Node.js/Express)
│   ├── tests/
│   │   ├── unit/       # Unit tests
│   │   └── integration/ # Integration tests
│   └── jest.config.js
├── client_app/         # Frontend Client (React)
│   └── src/__tests__/
├── admin_app/          # Frontend Admin (React)
│   └── src/__tests__/
└── .github/
    └── workflows/
        └── ci-cd.yml   # GitHub Actions workflow
```

## Tests

### Server Tests (Backend)

#### Unit Tests
```bash
cd server_app
npm run test:unit
```

**Coverage:**
- Models (User, Product, Order, Category, Cart, etc.)
- Business logic
- Utilities

#### Integration Tests
```bash
cd server_app
npm run test:integration
```

**Coverage:**
- API endpoints
- Database operations
- Authentication flow
- Payment processing

#### Test Coverage
```bash
cd server_app
npm run test:coverage
```

### Client Tests (Frontend)

#### React Component Tests
```bash
cd client_app
npm test
```

**Coverage:**
- Authentication components (SignIn, SignUp)
- Cart functionality
- Product display
- Checkout process
- API integrations

#### Coverage Report
```bash
cd client_app
npm run test:coverage
```

### Admin Tests (Admin Panel)

```bash
cd admin_app
npm test
```

**Coverage:**
- Admin login
- Dashboard components
- Product management
- Order management

## CI/CD Pipeline

### GitHub Actions Workflow

Pipeline tự động chạy khi:
- Push code lên branches: `main`, `develop`, `kiet`
- Tạo Pull Request vào `main` hoặc `develop`

### Pipeline Stages

#### 1. **Server Tests**
- Setup MongoDB test database
- Install dependencies
- Run unit tests
- Run integration tests
- Generate coverage report

#### 2. **Client Tests**
- Install dependencies
- Run React tests
- Generate coverage report

#### 3. **Admin Tests**
- Install dependencies
- Run React tests
- Generate coverage report

#### 4. **Code Quality**
- ESLint kiểm tra server code
- ESLint kiểm tra client code
- ESLint kiểm tra admin code

#### 5. **E2E Tests**
- Start all services (MongoDB, Server, Client)
- Run end-to-end tests
- Cleanup

#### 6. **Build Docker Images**
- Build server image
- Build client image
- Build admin image
- Push to Docker Hub (nếu không phải PR)

#### 7. **Deploy** (chỉ trên main branch)
- Auto deploy to production

## Cài đặt và Chạy Tests Local

### Prerequisites
```bash
# Node.js 16.x
# MongoDB 5.x
```

### Setup

1. **Clone repository**
```bash
git clone https://github.com/Babyfat012/sgu25_doan_ktpm.git
cd sgu25_doan_ktpm
```

2. **Install dependencies cho tất cả projects**
```bash
# Server
cd server_app
npm install

# Client
cd ../client_app
npm install

# Admin
cd ../admin_app
npm install
```

3. **Cấu hình environment variables**
```bash
# server_app/.env
MONGO_URL=mongodb://localhost:27017/Clothes
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Chạy Tests

#### Chạy tất cả tests
```bash
# Server
cd server_app
npm test

# Client
cd client_app
npm test

# Admin
cd admin_app
npm test
```

#### Chạy tests với coverage
```bash
npm run test:coverage
```

#### Chạy tests ở watch mode (cho development)
```bash
npm run test:watch  # (chỉ server)
npm test           # (client/admin tự động ở watch mode)
```

## GitHub Actions & Container Registry

### ✅ Không Cần Setup Secrets!

Pipeline sử dụng **GitHub Container Registry (GHCR)** với các ưu điểm:

- ✅ **Tích hợp sẵn** - Không cần Docker Hub account
- ✅ **Tự động authenticate** - Sử dụng `GITHUB_TOKEN` built-in
- ✅ **Miễn phí** cho public repositories
- ✅ **Unlimited bandwidth** cho public images

### Docker Images

Images được push tới:
```
ghcr.io/babyfat012/sgu-server:latest
ghcr.io/babyfat012/sgu-client:latest
ghcr.io/babyfat012/sgu-admin:latest
```

Xem chi tiết trong file `GHCR_GUIDE.md`

## Test Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| Server    | 80%            |
| Client    | 70%            |
| Admin     | 70%            |

## Writing Tests

### Server Unit Test Example
```javascript
// server_app/tests/unit/models/user.test.js
describe('User Model', () => {
  test('should create a valid user', async () => {
    const user = await User.create({
      fullname: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '0123456789'
    });
    
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

### Server Integration Test Example
```javascript
// server_app/tests/integration/api/product.test.js
describe('Product API', () => {
  test('should get all products', async () => {
    const products = await Product.find();
    expect(products).toBeDefined();
  });
});
```

### Client Component Test Example
```javascript
// client_app/src/__tests__/Auth/SignIn.test.js
describe('SignIn Component', () => {
  test('renders sign in form', () => {
    render(<SignIn />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
```

## Continuous Integration

### Status Badge
Thêm badge vào README để hiển thị trạng thái CI:

```markdown
![CI/CD Pipeline](https://github.com/Babyfat012/sgu25_doan_ktpm/workflows/CI/CD%20Pipeline/badge.svg)
```

### Xem Kết quả Tests
- Vào tab **Actions** trên GitHub repository
- Click vào workflow run để xem chi tiết
- Xem logs của từng job

## Best Practices

1. **Viết tests trước khi commit code mới**
2. **Maintain test coverage trên 70%**
3. **Sửa failing tests ngay lập tức**
4. **Review test results trong Pull Requests**
5. **Update tests khi thay đổi logic**

## Debugging Failed Tests

### Local
```bash
# Chạy test cụ thể
npm test -- --testPathPattern=user.test.js

# Chạy với verbose output
npm test -- --verbose

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### CI/CD
- Xem logs trong GitHub Actions
- Re-run failed jobs
- Check environment variables
- Verify database connections

## Docker Testing

```bash
# Build và test với Docker
docker-compose up -d mongo
docker-compose run server_app npm test
docker-compose run client_app npm test
docker-compose run admin_app npm test
```

## Monitoring & Reports

- **Code Coverage**: Upload to Codecov
- **Test Results**: GitHub Actions summary
- **Performance**: Jest performance metrics

## Troubleshooting

### MongoDB Connection Issues
```bash
# Kiểm tra MongoDB đang chạy
mongosh --eval "db.runCommand({ ping: 1 })"

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Port Conflicts
```bash
# Kill process on port
lsof -ti:8000 | xargs kill  # Server
lsof -ti:3000 | xargs kill  # Client
lsof -ti:3001 | xargs kill  # Admin
```

### Test Timeouts
Tăng timeout trong jest.config.js:
```javascript
testTimeout: 30000  // 30 seconds
```

## Contributing

1. Fork repository
2. Create feature branch
3. Write tests cho new features
4. Ensure all tests pass
5. Submit Pull Request

## License

ISC

## Support

Nếu gặp vấn đề với CI/CD hoặc tests, vui lòng tạo issue trên GitHub.
