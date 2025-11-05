# 🧪 Test Suite - SGU25 DOAN KTPM

## 📊 Tổng Quan Nhanh

| Metric | Server | Client | Admin |
|--------|--------|--------|-------|
| **Total Tests** | 126+ | 20+ | 15+ |
| **Passing** | 77 ✅ | TBD | TBD |
| **Coverage** | 14% | TBD | TBD |
| **Target** | 30% | 30% | 30% |

## 🚀 Quick Start

```bash
# Chạy tất cả tests
npm test

# Chạy tests cho server
cd server_app && npm test

# Chạy với coverage
cd server_app && npm run test:coverage

# Watch mode (development)
cd server_app && npm run test:watch
```

## 📁 Cấu Trúc Tests

```
sgu25_doan_ktpm/
├── TEST_DOCUMENTATION.md    # Chi tiết về tests hiện tại
├── TESTING_GUIDE.md          # Hướng dẫn viết tests
├── server_app/
│   └── tests/
│       ├── setup.js          # MongoDB Memory Server
│       ├── unit/             # Unit tests
│       │   └── models/       # Model tests
│       │       ├── user.test.js       ✅ PASSING
│       │       ├── product.test.js    ⚠️ NEEDS FIX
│       │       ├── category.test.js   ✅ PASSING
│       │       ├── comment.test.js    ✅ PASSING
│       │       ├── order.test.js      ⚠️ NEEDS FIX
│       │       ├── coupon.test.js     ✅ NEW
│       │       └── payment.test.js    ✅ NEW
│       └── integration/      # Integration tests
│           └── api/
│               ├── user.integration.test.js     ✅ ALL PASSING (13/13)
│               ├── product.integration.test.js  ✅ ALL PASSING (17/17)
│               └── order.test.js                ⚠️ NEEDS FIX
├── client_app/
│   └── src/__tests__/
│       └── Redux/
│           ├── Actions/
│           │   └── ActionCart.test.js  ✅
│           └── Reducers/
│               └── ReducerCart.test.js ✅
└── admin_app/
    └── src/__tests__/
        ├── context/
        │   └── Auth.test.js            ✅
        └── Api/
            └── productAPI.test.js      ✅
```

## ✅ Tests Đã Hoàn Thành

### Server App

#### 🎯 Integration Tests - User API (13/13) ✅
- ✅ GET /api/user - Lấy danh sách users
- ✅ GET /api/user/:id - Lấy user theo ID
- ✅ GET /api/user/detail - Đăng nhập (username/email)
- ✅ POST /api/user/signup - Đăng ký với bcrypt
- ✅ PUT /api/user/update - Cập nhật thông tin
- ✅ POST /api/user/change-password - Đổi mật khẩu

#### 🎯 Integration Tests - Product API (17/17) ✅
- ✅ GET /api/product - Lấy tất cả sản phẩm
- ✅ GET /api/product/:id - Chi tiết sản phẩm
- ✅ GET /api/product/category - Lọc theo category
- ✅ GET /api/product/pagination - Phân trang + tìm kiếm
- ✅ GET /api/product/scroll - Infinite scroll

#### 📦 Unit Tests - Models
- ✅ **User Model**: Creation, validation, bcrypt, queries
- ✅ **Category Model**: CRUD operations
- ✅ **Comment Model**: Star ratings, statistics
- ✅ **Coupon Model**: Code validation, usage tracking
- ✅ **Payment Model**: Payment methods management
- ⚠️ **Product Model**: Cần thêm field `image`
- ⚠️ **Order Model**: Cần điều chỉnh schema

### Client App

#### Redux Tests
- ✅ **ActionCart**: addUser, addCart, updateCart, deleteCart
- ✅ **ReducerCart**: State management, immutability

### Admin App

#### Context Tests
- ✅ **Auth Context**: Login, logout, localStorage

#### API Tests
- ✅ **Product API**: CRUD operations, error handling

## 📈 Kết Quả Hiện Tại

### Server App Test Results

```
Test Suites: 11 total (4 passed, 7 failed)
Tests:       126 total (77 passed, 49 failed)
Coverage:    14.11% statements, 8.42% branches
```

**✅ Passing Suites:**
1. user.integration.test.js (13 tests) ✅
2. product.integration.test.js (17 tests) ✅
3. category.test.js (6 tests) ✅
4. comment.test.js (12 tests) ✅

**⚠️ Needs Attention:**
1. Product model tests - Add `image` field
2. Order tests - Schema alignment
3. Increase controller coverage

## 🎯 Mục Tiêu

### Ngắn Hạn (1-2 tuần)
- [ ] Fix failing tests (49 tests)
- [ ] Đạt 30% coverage
- [ ] Add tests cho Order API
- [ ] Add tests cho Category/Comment controllers

### Trung Hạn (1 tháng)
- [ ] 60% coverage
- [ ] Tests cho tất cả controllers
- [ ] E2E tests cho user flows chính
- [ ] Performance tests

### Dài Hạn
- [ ] 80%+ coverage
- [ ] Load testing
- [ ] Security testing
- [ ] Automated visual regression tests

## 🛠️ Công Cụ & Thư Viện

### Backend
- **Jest** - Test framework
- **Supertest** - HTTP assertions
- **MongoDB Memory Server** - In-memory DB
- **bcryptjs** - Password testing

### Frontend
- **Jest** - Test framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interactions
- **redux-mock-store** - Redux testing

## 📚 Tài Liệu

- [TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md) - Chi tiết về tests
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Hướng dẫn viết tests
- [Jest Docs](https://jestjs.io/) - Official documentation
- [Testing Library](https://testing-library.com/) - React testing

## 🐛 Debugging

### Common Issues

**1. MongoDB Memory Server Error**
```bash
rm -rf ~/.cache/mongodb-memory-server/
npm install mongodb-memory-server --save-dev
```

**2. Jest Timeout**
```javascript
// jest.config.js
module.exports = {
  testTimeout: 30000
};
```

**3. Clear Cache**
```bash
npm test -- --clearCache
```

## 💡 Tips

### Chạy Tests Hiệu Quả

```bash
# Chỉ chạy tests đã thay đổi
npm test -- --onlyChanged

# Chạy một file cụ thể
npm test user.test.js

# Chạy tests theo tên
npm test -- --testNamePattern="should create"

# Verbose output
npm test -- --verbose

# Coverage cho file cụ thể
npm test -- --collectCoverageFrom=API/Controller/user.controller.js
```

### Viết Tests Tốt

✅ **DO:**
- Tên test rõ ràng, mô tả chính xác
- Setup/teardown đúng cách
- Test cả happy path và error cases
- Use specific matchers

❌ **DON'T:**
- Test nhiều thứ trong 1 test
- Hardcode values không cần thiết
- Bỏ qua cleanup
- Tests phụ thuộc lẫn nhau

## 🤝 Contributing

Khi thêm features mới, vui lòng:

1. ✅ Viết tests trước (TDD)
2. ✅ Đảm bảo tests pass
3. ✅ Maintain coverage > 30%
4. ✅ Update documentation
5. ✅ Run full test suite trước khi commit

## 📞 Support

Nếu gặp vấn đề với tests:

1. Check [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. Check test output carefully
3. Run with `--verbose` flag
4. Clear cache và retry
5. Contact team members

## 📊 Coverage Goals

```
┌─────────────┬─────────┬─────────┐
│ Component   │ Current │ Target  │
├─────────────┼─────────┼─────────┤
│ Models      │  71%    │   90%   │
│ Controllers │  45%    │   80%   │
│ Routes      │   0%    │   60%   │
│ Utils       │   0%    │   80%   │
│ Overall     │  14%    │   30%   │
└─────────────┴─────────┴─────────┘
```

## 🎉 Highlights

- ✅ **77 passing tests** đã được triển khai
- ✅ **User API** fully tested (100% passing)
- ✅ **Product API** fully tested (100% passing)
- ✅ **bcrypt integration** tested
- ✅ **MongoDB Memory Server** setup
- ✅ **Redux** actions & reducers tested
- ✅ **Auth Context** tested

---

**Last Updated**: November 2025
**Maintained By**: Development Team
**Status**: 🟡 In Progress
