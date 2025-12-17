# Hướng Dẫn Viết và Chạy Tests

## Mục Lục
1. [Giới Thiệu](#giới-thiệu)
2. [Cài Đặt](#cài-đặt)
3. [Chạy Tests](#chạy-tests)
4. [Viết Unit Tests](#viết-unit-tests)
5. [Viết Integration Tests](#viết-integration-tests)
6. [Best Practices](#best-practices)
7. [Debugging](#debugging)
8. [CI/CD Integration](#cicd-integration)

## Giới Thiệu

Dự án sử dụng **Jest** làm test framework chính cho cả backend và frontend. Tests được chia thành 2 loại:

- **Unit Tests**: Test các component/function độc lập
- **Integration Tests**: Test các API endpoints và luồng nghiệp vụ

## Cài Đặt

### 1. Cài đặt dependencies

```bash
# Root project
npm install

# Server app
cd server_app
npm install

# Client app
cd client_app
npm install

# Admin app
cd admin_app
npm install
```

### 2. Kiểm tra cấu hình

File `server_app/jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'API/**/*.js',
    'Models/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  verbose: true
};
```

## Chạy Tests

### Chạy tất cả tests

```bash
# Từ root directory
npm test

# Hoặc chạy từng app
cd server_app && npm test
cd client_app && npm test
cd admin_app && npm test
```

### Chạy tests cụ thể

```bash
# Chạy một file test
npm test user.test.js

# Chạy tests theo pattern
npm test -- --testNamePattern="should create"

# Chạy tests trong một folder
npm test tests/unit/models/
```

### Chạy với coverage

```bash
# Server app
cd server_app
npm run test:coverage

# Client app
cd client_app
npm run test:coverage

# Admin app
cd admin_app
npm run test:coverage
```

### Watch mode

```bash
# Server app
cd server_app
npm run test:watch

# Client/Admin app (React)
npm test
# Sau đó nhấn 'a' để chạy tất cả tests
```

## Viết Unit Tests

### 1. Test cho Models

**Template cơ bản:**

```javascript
const ModelName = require('../../../Models/modelName');

describe('ModelName Unit Tests', () => {
  // Cleanup sau mỗi test
  afterEach(async () => {
    await ModelName.deleteMany({});
  });

  describe('Creation', () => {
    test('should create with valid data', async () => {
      const data = {
        field1: 'value1',
        field2: 'value2'
      };

      const doc = await ModelName.create(data);

      expect(doc).toBeDefined();
      expect(doc.field1).toBe('value1');
      expect(doc.field2).toBe('value2');
    });

    test('should fail without required fields', async () => {
      const invalidData = {};
      
      await expect(ModelName.create(invalidData))
        .rejects.toThrow();
    });
  });

  describe('Queries', () => {
    beforeEach(async () => {
      // Setup test data
      await ModelName.create([
        { field1: 'test1' },
        { field1: 'test2' }
      ]);
    });

    test('should find all documents', async () => {
      const docs = await ModelName.find();
      expect(docs).toHaveLength(2);
    });

    test('should find by field', async () => {
      const doc = await ModelName.findOne({ field1: 'test1' });
      expect(doc).toBeDefined();
      expect(doc.field1).toBe('test1');
    });
  });

  describe('Updates', () => {
    test('should update document', async () => {
      const doc = await ModelName.create({ field1: 'old' });
      
      doc.field1 = 'new';
      await doc.save();

      const updated = await ModelName.findById(doc._id);
      expect(updated.field1).toBe('new');
    });
  });

  describe('Deletion', () => {
    test('should delete document', async () => {
      const doc = await ModelName.create({ field1: 'delete' });
      
      await ModelName.deleteOne({ _id: doc._id });
      
      const deleted = await ModelName.findById(doc._id);
      expect(deleted).toBeNull();
    });
  });
});
```

**Ví dụ thực tế - User Model:**

```javascript
const Users = require('../../../Models/user');
const bcrypt = require('bcryptjs');

describe('User Model Unit Tests', () => {
  afterEach(async () => {
    await Users.deleteMany({});
  });

  test('should hash password before saving', async () => {
    const userData = {
      username: 'testuser',
      password: 'plaintext123',
      email: 'test@example.com'
    };

    const user = await Users.create(userData);

    // Password không nên là plaintext
    expect(user.password).not.toBe('plaintext123');
    
    // Verify bcrypt hash
    const isMatch = await bcrypt.compare('plaintext123', user.password);
    expect(isMatch).toBe(true);
  });
});
```

### 2. Test cho Redux Actions

```javascript
import { actionName } from '../../../Redux/Action/ActionFile';

describe('Action Name', () => {
  test('should create correct action', () => {
    const data = { id: 1, name: 'Test' };
    const expectedAction = {
      type: 'ACTION_TYPE',
      data
    };
    
    expect(actionName(data)).toEqual(expectedAction);
  });
});
```

### 3. Test cho Redux Reducers

```javascript
import reducer from '../../../Redux/Reducer/ReducerFile';

describe('Reducer Name', () => {
  const initialState = {
    items: []
  };

  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  test('should handle ACTION_TYPE', () => {
    const action = {
      type: 'ACTION_TYPE',
      data: { id: 1, name: 'Test' }
    };

    const newState = reducer(initialState, action);

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0]).toEqual(action.data);
  });
});
```

## Viết Integration Tests

### 1. Test cho API Endpoints

**Setup:**

```javascript
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Import models
const Model = require('../../../Models/model');

// Setup Express app
const app = express();
app.use(express.json());

// Import and setup router
const controller = require('../../../API/Controller/controller');
const router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:id', controller.detail);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

app.use('/api/resource', router);
```

**Test cases:**

```javascript
describe('Resource API Integration Tests', () => {
  let testData;

  beforeEach(async () => {
    // Setup test data
    testData = await Model.create({
      name: 'Test',
      value: 100
    });
  });

  afterEach(async () => {
    // Cleanup
    await Model.deleteMany({});
  });

  describe('GET /api/resource', () => {
    test('should get all resources', async () => {
      const response = await request(app)
        .get('/api/resource')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/resource/:id', () => {
    test('should get resource by id', async () => {
      const response = await request(app)
        .get(`/api/resource/${testData._id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('Test');
    });

    test('should return 404 for invalid id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .get(`/api/resource/${fakeId}`)
        .expect(404);
    });
  });

  describe('POST /api/resource', () => {
    test('should create new resource', async () => {
      const newData = {
        name: 'New Resource',
        value: 200
      };

      const response = await request(app)
        .post('/api/resource')
        .send(newData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('New Resource');

      // Verify in database
      const created = await Model.findById(response.body._id);
      expect(created).toBeDefined();
    });

    test('should fail with invalid data', async () => {
      const invalidData = {};

      await request(app)
        .post('/api/resource')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('PUT /api/resource/:id', () => {
    test('should update resource', async () => {
      const updateData = {
        name: 'Updated Name',
        value: 300
      };

      const response = await request(app)
        .put(`/api/resource/${testData._id}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.name).toBe('Updated Name');

      // Verify in database
      const updated = await Model.findById(testData._id);
      expect(updated.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/resource/:id', () => {
    test('should delete resource', async () => {
      await request(app)
        .delete(`/api/resource/${testData._id}`)
        .expect(200);

      // Verify deletion
      const deleted = await Model.findById(testData._id);
      expect(deleted).toBeNull();
    });
  });
});
```

## Best Practices

### 1. Test Organization

✅ **DO:**
```javascript
describe('User Management', () => {
  describe('Registration', () => {
    test('should register with valid email', () => {});
    test('should reject duplicate email', () => {});
  });

  describe('Login', () => {
    test('should login with correct credentials', () => {});
    test('should reject wrong password', () => {});
  });
});
```

❌ **DON'T:**
```javascript
test('test 1', () => {});
test('test 2', () => {});
test('test 3', () => {});
```

### 2. Test Names

✅ **DO:**
```javascript
test('should create user with valid data', () => {});
test('should return 404 when user not found', () => {});
test('should hash password before saving', () => {});
```

❌ **DON'T:**
```javascript
test('test user', () => {});
test('works', () => {});
test('123', () => {});
```

### 3. Setup and Teardown

✅ **DO:**
```javascript
describe('Tests', () => {
  beforeEach(async () => {
    // Reset state trước mỗi test
    await Model.deleteMany({});
  });

  afterEach(async () => {
    // Cleanup sau mỗi test
  });

  test('test case', () => {
    // Test code
  });
});
```

### 4. Assertions

✅ **DO:**
```javascript
// Specific matchers
expect(user.email).toBe('test@example.com');
expect(users).toHaveLength(3);
expect(response.status).toBe(200);
expect(error).toBeInstanceOf(Error);
expect(result).toEqual({ id: 1, name: 'Test' });
```

❌ **DON'T:**
```javascript
// Generic matchers
expect(user.email).toBeTruthy();
expect(users.length > 0).toBe(true);
```

### 5. Async Tests

✅ **DO:**
```javascript
test('async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

test('async error', async () => {
  await expect(asyncFunction()).rejects.toThrow();
});
```

❌ **DON'T:**
```javascript
test('async operation', () => {
  asyncFunction().then(result => {
    expect(result).toBeDefined(); // Có thể không chạy!
  });
});
```

## Debugging

### 1. Console Logging

```javascript
test('debug test', () => {
  const data = { id: 1, name: 'Test' };
  console.log('Data:', data);
  
  expect(data.id).toBe(1);
});
```

### 2. Isolate Tests

```javascript
// Chỉ chạy test này
test.only('focused test', () => {
  // Test code
});

// Bỏ qua test này
test.skip('skipped test', () => {
  // Test code
});
```

### 3. Increase Timeout

```javascript
test('slow test', async () => {
  // Test code
}, 15000); // 15 giây

// Hoặc global
jest.setTimeout(30000);
```

### 4. Debug Mode

```bash
# Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Sau đó mở Chrome và vào chrome://inspect
```

## CI/CD Integration

### GitHub Actions Example

`.github/workflows/test.yml`:
```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: |
          npm install
          cd server_app && npm install
          cd ../client_app && npm install
          cd ../admin_app && npm install
      
      - name: Run server tests
        run: cd server_app && npm test -- --coverage
      
      - name: Run client tests
        run: cd client_app && npm test -- --watchAll=false --coverage
      
      - name: Run admin tests
        run: cd admin_app && npm test -- --watchAll=false --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          directory: ./coverage
```

## Troubleshooting

### Lỗi: MongoDB Memory Server

```bash
# Cài đặt lại
npm install mongodb-memory-server --save-dev

# Clear cache
rm -rf ~/.cache/mongodb-memory-server/
```

### Lỗi: Jest timeout

```javascript
// Tăng timeout trong jest.config.js
module.exports = {
  testTimeout: 30000 // 30 giây
};
```

### Lỗi: Module not found

```bash
# Clear Jest cache
npm test -- --clearCache

# Rebuild node_modules
rm -rf node_modules
npm install
```

## Tài Liệu Tham Khảo

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Library](https://testing-library.com/docs/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
