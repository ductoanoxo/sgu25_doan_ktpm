# CI/CD Pipeline Documentation

## 📋 Tổng quan

Repository này sử dụng GitHub Actions để tự động hóa quy trình CI/CD.

## 🔄 Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)

**Trigger:** 
- Push lên các nhánh: `main`, `kiet`, `giai-doan-1`, `giai-doan-2`, `giai-doan-3`, `giai-doan-4`
- Pull Request vào nhánh `main`

**Jobs:**
1. **test-server**: Test Server Application
2. **test-client**: Test và Build Client Application
3. **test-admin**: Test và Build Admin Application
4. **docker-build**: Build Docker images cho tất cả services
5. **docker-compose-test**: Test Docker Compose integration
6. **security-scan**: Scan lỗ hổng bảo mật
7. **notify-success**: Thông báo khi build thành công

### 2. Deploy Pipeline (`deploy.yml`)

**Trigger:**
- Push lên nhánh `main`
- Manual trigger (workflow_dispatch)

**Jobs:**
1. **deploy**: Deploy application lên production

## ⚙️ Cấu hình GitHub Secrets

Để sử dụng đầy đủ tính năng CI/CD, bạn cần cấu hình các secrets sau:

### Bước 1: Vào GitHub Repository Settings
1. Vào repository trên GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Bước 2: Thêm các secrets

#### Cho Docker Hub (Optional):
```
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_password_or_token
```

#### Cho SSH Deploy (Optional):
```
SERVER_HOST=your.server.ip.address
SERVER_USERNAME=your_ssh_username
SSH_PRIVATE_KEY=your_ssh_private_key
```

## 🚀 Cách sử dụng

### 1. Push code lên GitHub
```bash
git add .
git commit -m "Your commit message"
git push origin kiet
```

### 2. Theo dõi pipeline
1. Vào tab **Actions** trên GitHub repository
2. Xem workflow đang chạy
3. Click vào workflow để xem chi tiết

### 3. Manual Deploy
1. Vào tab **Actions**
2. Chọn workflow **Deploy to Production**
3. Click **Run workflow**
4. Chọn branch và click **Run workflow**

## 🐛 Troubleshooting

### Pipeline bị fail?

1. **Check logs**: Click vào job bị fail để xem log chi tiết
2. **Dependencies issue**: Đảm bảo `package-lock.json` được commit
3. **Docker build fail**: Check Dockerfile syntax
4. **Tests fail**: Run tests locally trước khi push

### Cách test locally

```bash
# Test Server
cd server_app
npm install
npm test

# Test Client
cd client_app
npm install
npm test -- --watchAll=false
npm run build

# Test Admin
cd admin_app
npm install
npm test -- --watchAll=false
npm run build

# Test Docker Compose
docker compose up --build
```

## 📝 Best Practices

1. ✅ Luôn test code locally trước khi push
2. ✅ Viết commit message rõ ràng
3. ✅ Tạo Pull Request cho các thay đổi quan trọng
4. ✅ Review code trước khi merge vào `main`
5. ✅ Giữ `main` branch luôn stable

## 🔐 Security

- Không commit `.env` files
- Sử dụng GitHub Secrets cho sensitive data
- Thường xuyên update dependencies
- Review security scan results

## 📞 Support

Nếu gặp vấn đề, hãy:
1. Check workflow logs
2. Đọc error messages carefully
3. Search GitHub Issues
4. Tạo issue mới nếu cần

---

**Created**: October 2025
**Last Updated**: October 2025
