# HƯỚNG DẪN SỬ DỤNG CLOUDINARY

## 1. Đăng ký tài khoản Cloudinary

1. Truy cập: https://cloudinary.com/
2. Đăng ký tài khoản miễn phí (Free tier: 25GB storage, 25GB bandwidth/tháng)
3. Sau khi đăng nhập, vào Dashboard để lấy thông tin:
   - **Cloud Name**: Tên cloud của bạn
   - **API Key**: Khóa API
   - **API Secret**: Khóa bí mật

## 2. Cấu hình môi trường

Cập nhật file `.env` với thông tin từ Cloudinary Dashboard:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 3. API Endpoints

### 3.1. Upload một ảnh

**Endpoint**: `POST /api/upload/single`

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData với field `image`

**Example (JavaScript)**:
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:8000/api/upload/single', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    console.log('Image URL:', data.data.url);
})
.catch(error => console.error('Error:', error));
```

**Response**:
```json
{
    "success": true,
    "message": "Upload ảnh thành công",
    "data": {
        "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/fashion-shop/abc123.jpg",
        "publicId": "fashion-shop/abc123",
        "width": 1000,
        "height": 1000
    }
}
```

### 3.2. Upload nhiều ảnh

**Endpoint**: `POST /api/upload/multiple`

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData với field `images` (mảng, tối đa 10 ảnh)

**Example**:
```javascript
const formData = new FormData();
for (let i = 0; i < fileInput.files.length; i++) {
    formData.append('images', fileInput.files[i]);
}

fetch('http://localhost:8000/api/upload/multiple', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    console.log('Uploaded images:', data.data);
})
.catch(error => console.error('Error:', error));
```

**Response**:
```json
{
    "success": true,
    "message": "Upload 3 ảnh thành công",
    "data": [
        {
            "url": "https://res.cloudinary.com/...",
            "publicId": "fashion-shop/abc123",
            "width": 1000,
            "height": 1000
        },
        // ... more images
    ]
}
```

### 3.3. Xóa ảnh

**Endpoint**: `DELETE /api/upload/remove`

**Request**:
- Method: DELETE
- Content-Type: application/json
- Body: `{ "publicId": "fashion-shop/abc123" }` hoặc `{ "imageUrl": "https://..." }`

**Example**:
```javascript
fetch('http://localhost:8000/api/upload/remove', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        publicId: 'fashion-shop/abc123'
    })
})
.then(response => response.json())
.then(data => console.log('Delete result:', data))
.catch(error => console.error('Error:', error));
```

**Response**:
```json
{
    "success": true,
    "message": "Xóa ảnh thành công",
    "data": {
        "result": "ok"
    }
}
```

## 4. Sử dụng trong React Component

### 4.1. Component Upload Ảnh

```jsx
import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Vui lòng chọn ảnh');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/upload/single', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setImageUrl(response.data.data.url);
                alert('Upload thành công!');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Đang upload...' : 'Upload'}
            </button>
            {imageUrl && (
                <div>
                    <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
                    <p>URL: {imageUrl}</p>
                </div>
            )}
        </div>
    );
}

export default ImageUpload;
```

### 4.2. Upload trong Form Tạo Sản phẩm

```jsx
const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post('http://localhost:8000/api/upload/single', formData);
        if (response.data.success) {
            // Lưu URL vào state hoặc gửi lên server
            setProductImage(response.data.data.url);
        }
    } catch (error) {
        console.error('Upload failed:', error);
    }
};
```

## 5. Giới hạn và Lưu ý

### 5.1. Giới hạn hiện tại

- **Kích thước file**: Tối đa 5MB/ảnh
- **Số lượng**: Tối đa 10 ảnh/lần upload (multiple)
- **Format hỗ trợ**: JPG, JPEG, PNG, GIF, WEBP
- **Tự động resize**: Giới hạn tối đa 1000x1000px (giữ tỷ lệ)

### 5.2. Cấu trúc lưu trữ trên Cloudinary

- Thư mục gốc: `fashion-shop/`
- Có thể tùy chỉnh trong file `config/cloudinary.js`

### 5.3. Bảo mật

- ⚠️ **Chú ý**: API Upload hiện tại là public
- Nên thêm middleware authentication cho các route upload
- Ví dụ: `router.post('/single', authMiddleware, uploadSingle, uploadImage);`

## 6. Tích hợp vào Product Controller

Khi tạo/cập nhật sản phẩm, thay vì lưu file cục bộ:

```javascript
// Cũ: Lưu file vào thư mục public/img
req.files.image.mv('./public/img/' + filename);

// Mới: Upload lên Cloudinary trước, lấy URL rồi lưu vào database
const formData = new FormData();
formData.append('image', req.files.image);

const uploadResponse = await axios.post('http://localhost:8000/api/upload/single', formData);
const imageUrl = uploadResponse.data.data.url;

// Lưu imageUrl vào database
product.image = imageUrl;
```

## 7. Testing API với Postman

1. **Upload Single**:
   - URL: `POST http://localhost:8000/api/upload/single`
   - Body → form-data
   - Key: `image`, Type: File
   - Select file

2. **Upload Multiple**:
   - URL: `POST http://localhost:8000/api/upload/multiple`
   - Body → form-data
   - Key: `images`, Type: File (có thể chọn nhiều file)

3. **Delete Image**:
   - URL: `DELETE http://localhost:8000/api/upload/remove`
   - Body → raw → JSON
   - ```json
     {
       "publicId": "fashion-shop/abc123"
     }
     ```

## 8. Troubleshooting

### Lỗi "Missing required parameter - file"
- Kiểm tra field name phải đúng (`image` cho single, `images` cho multiple)
- Kiểm tra Content-Type: multipart/form-data

### Lỗi "Invalid credentials"
- Kiểm tra lại CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET trong .env
- Đảm bảo file .env được load: `require('dotenv').config()`

### Lỗi "File size too large"
- Giảm kích thước ảnh xuống dưới 5MB
- Hoặc tăng giới hạn trong `config/cloudinary.js`: `fileSize: 10 * 1024 * 1024`

## 9. Migration từ hệ thống cũ

Nếu đã có ảnh lưu local, cần:
1. Upload tất cả ảnh lên Cloudinary
2. Cập nhật URL trong database
3. Xóa ảnh cục bộ (sau khi backup)

Script migration (tham khảo):
```javascript
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function migrateImages() {
    const imagesDir = './public/img';
    const files = fs.readdirSync(imagesDir);

    for (const file of files) {
        const formData = new FormData();
        const filePath = path.join(imagesDir, file);
        formData.append('image', fs.createReadStream(filePath));

        try {
            const response = await axios.post('http://localhost:8000/api/upload/single', formData);
            console.log(`Uploaded ${file}: ${response.data.data.url}`);
            
            // TODO: Cập nhật URL trong database
        } catch (error) {
            console.error(`Failed to upload ${file}:`, error.message);
        }
    }
}
```

## 10. Best Practices

1. **Lazy Loading**: Sử dụng Cloudinary transformation để tối ưu tải ảnh
2. **Responsive Images**: Tạo nhiều kích thước khác nhau
3. **CDN**: Cloudinary tự động phân phối qua CDN toàn cầu
4. **Backup**: Luôn giữ backup ảnh gốc
5. **Naming**: Đặt tên file có ý nghĩa trước khi upload
6. **Cleanup**: Xóa ảnh không dùng trên Cloudinary để tiết kiệm dung lượng

---

**Liên hệ hỗ trợ**: Cloudinary Documentation - https://cloudinary.com/documentation
