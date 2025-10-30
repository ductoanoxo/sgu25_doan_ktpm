# GitHub Container Registry (GHCR) - Hướng Dẫn

## 🎯 Tổng Quan

CI/CD pipeline đã được cấu hình để sử dụng **GitHub Container Registry (GHCR)** thay vì Docker Hub.

### ✨ Ưu Điểm của GHCR

- ✅ **Tích hợp sẵn** với GitHub - không cần tạo account riêng
- ✅ **Không cần secrets** - sử dụng `GITHUB_TOKEN` tự động
- ✅ **Miễn phí** cho public repositories
- ✅ **Unlimited bandwidth** cho public images
- ✅ **Gắn với repository** - dễ quản lý permissions
- ✅ **Auto cleanup** - có thể tự động xóa old images

## 🚀 Setup

### Bước 1: Không cần làm gì!

GHCR đã được cấu hình tự động trong CI/CD workflow. Bạn **không cần**:
- ❌ Tạo Docker Hub account
- ❌ Thêm DOCKER_USERNAME secret
- ❌ Thêm DOCKER_PASSWORD secret

GitHub Actions sẽ tự động:
- ✅ Login vào GHCR bằng `GITHUB_TOKEN`
- ✅ Build Docker images
- ✅ Push images lên GHCR

### Bước 2: Đảm bảo Package Permissions

1. Sau lần push đầu tiên, vào GitHub repository
2. Click tab **Packages** (nếu có)
3. Click vào package (vd: `sgu-server`)
4. Settings → Change visibility thành **Public** (nếu muốn)

## 📦 Docker Images

### Image Naming Convention

Images sẽ được tạo với tên:
```
ghcr.io/babyfat012/sgu-server:latest
ghcr.io/babyfat012/sgu-client:latest
ghcr.io/babyfat012/sgu-admin:latest
```

### Image Tags

Pipeline tự động tạo nhiều tags:

**Main branch:**
- `latest` - Latest stable version
- `main` - Branch name tag
- `main-abc1234` - Branch + commit SHA

**Feature branches (vd: kiet):**
- `kiet` - Branch name
- `kiet-abc1234` - Branch + commit SHA

**Pull Requests:**
- `pr-123` - PR number tag

## 🔍 Xem Docker Images

### Trên GitHub

1. Vào repository: https://github.com/Babyfat012/sgu25_doan_ktpm
2. Click vào **Packages** ở sidebar bên phải
3. Hoặc truy cập trực tiếp:
   - https://github.com/Babyfat012/sgu25_doan_ktpm/pkgs/container/sgu-server
   - https://github.com/Babyfat012/sgu25_doan_ktpm/pkgs/container/sgu-client
   - https://github.com/Babyfat012/sgu25_doan_ktpm/pkgs/container/sgu-admin

### Command Line

```bash
# List available tags
docker images ghcr.io/babyfat012/sgu-server

# Pull latest image
docker pull ghcr.io/babyfat012/sgu-server:latest
```

## 💻 Sử dụng Images

### Docker Run

```bash
# Server
docker run -p 8000:8000 ghcr.io/babyfat012/sgu-server:latest

# Client
docker run -p 3000:3000 ghcr.io/babyfat012/sgu-client:latest

# Admin
docker run -p 3001:3001 ghcr.io/babyfat012/sgu-admin:latest
```

### Docker Compose

Cập nhật `docker-compose.yml`:

```yaml
version: '3.8'

services:
  server_app:
    image: ghcr.io/babyfat012/sgu-server:latest
    # ... rest of config

  client_app:
    image: ghcr.io/babyfat012/sgu-client:latest
    # ... rest of config

  admin_app:
    image: ghcr.io/babyfat012/sgu-admin:latest
    # ... rest of config
```

### Pull từ GHCR

**Public images** (không cần login):
```bash
docker pull ghcr.io/babyfat012/sgu-server:latest
```

**Private images** (cần login):
```bash
# Login với Personal Access Token
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull image
docker pull ghcr.io/babyfat012/sgu-server:latest
```

## 🔐 Authentication (nếu cần)

### Tạo Personal Access Token (PAT)

1. Vào GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Chọn scopes:
   - ✅ `read:packages` - Pull images
   - ✅ `write:packages` - Push images
   - ✅ `delete:packages` - Delete images
4. Copy token

### Login từ Local Machine

```bash
# Set token as environment variable
export GITHUB_TOKEN=ghp_your_token_here

# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### Logout

```bash
docker logout ghcr.io
```

## 🔄 CI/CD Workflow

### Automatic Build & Push

**Khi push code:**
```bash
git add .
git commit -m "Your changes"
git push origin kiet
```

**Pipeline tự động:**
1. ✅ Run all tests
2. ✅ Build Docker images
3. ✅ Tag images appropriately
4. ✅ Push to GHCR
5. ✅ Images available tại `ghcr.io/babyfat012/`

### Image Tags được tạo

**Branch `kiet`:**
```
ghcr.io/babyfat012/sgu-server:kiet
ghcr.io/babyfat012/sgu-server:kiet-abc1234
```

**Branch `main`:**
```
ghcr.io/babyfat012/sgu-server:latest
ghcr.io/babyfat012/sgu-server:main
ghcr.io/babyfat012/sgu-server:main-abc1234
```

## 🧹 Quản Lý Images

### Xóa Old Images

1. Vào Package page trên GitHub
2. Click vào version cần xóa
3. Click "Delete"

### Automated Cleanup (Optional)

Thêm vào workflow để tự động xóa old images:

```yaml
- name: Delete old container images
  uses: actions/delete-package-versions@v4
  with:
    package-name: 'sgu-server'
    package-type: 'container'
    min-versions-to-keep: 10
    delete-only-untagged-versions: 'true'
```

## 📊 Package Visibility

### Public Package (Recommended cho open source)

**Ưu điểm:**
- Mọi người có thể pull không cần authentication
- Miễn phí bandwidth
- Tốt cho demo và sharing

**Cách đổi:**
1. Vào Package settings
2. Danger Zone → Change visibility
3. Chọn "Public"

### Private Package

**Ưu điểm:**
- Bảo mật hơn
- Chỉ có authorized users pull được

**Lưu ý:**
- Cần authenticate để pull
- Có giới hạn storage (500MB free)

## 🔧 Troubleshooting

### Error: "denied: permission_denied"

**Nguyên nhân:** Workflow không có quyền write packages

**Giải pháp:** Đã được fix trong workflow bằng:
```yaml
permissions:
  contents: read
  packages: write
```

### Error: "unauthorized: authentication required"

**Khi pull local:**
```bash
# Login first
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Then pull
docker pull ghcr.io/babyfat012/sgu-server:latest
```

### Image không xuất hiện trong Packages

1. Check GitHub Actions logs
2. Verify push thành công
3. Có thể mất vài phút để package xuất hiện

### Rate Limiting

GHCR có rate limits:
- **Anonymous:** 1,000 requests/hour
- **Authenticated:** 5,000 requests/hour

Luôn authenticate khi có thể.

## 📝 Best Practices

### 1. Tag Strategy

```yaml
# Good - semantic versioning
ghcr.io/babyfat012/sgu-server:v1.0.0
ghcr.io/babyfat012/sgu-server:v1.0
ghcr.io/babyfat012/sgu-server:latest

# Good - branch based
ghcr.io/babyfat012/sgu-server:main
ghcr.io/babyfat012/sgu-server:develop
```

### 2. Image Labels

Workflow tự động thêm labels:
- `org.opencontainers.image.source` - Link to repo
- `org.opencontainers.image.revision` - Commit SHA
- `org.opencontainers.image.created` - Build timestamp

### 3. Cache Layers

Workflow sử dụng GitHub Actions cache:
```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

Giúp build nhanh hơn!

## 🎓 Resources

- [GHCR Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Metadata Action](https://github.com/docker/metadata-action)
- [GitHub Packages Pricing](https://docs.github.com/en/billing/managing-billing-for-github-packages/about-billing-for-github-packages)

## 📞 Support

Nếu gặp vấn đề với GHCR:
1. Check GitHub Actions logs
2. Verify permissions
3. Ensure package visibility settings
4. Create issue on GitHub

---

**GHCR đã được cấu hình tự động! Chỉ cần push code là xong! 🎉**
