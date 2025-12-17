# 📊 Phân Tích Quản Lý Tồn Kho - Đồ Án KTPM

## 🔍 Tình Trạng Hiện Tại

### ❌ **Vấn Đề Nghiêm Trọng: KHÔNG CÓ QUẢN LÝ TỒN KHO**

Sau khi phân tích toàn bộ source code, tôi phát hiện:

#### 1. **Model Product - Field `number` BỊ COMMENT**
```javascript
// server_app/Models/product.js
var schema = new mongoose.Schema({
    id_category: { type: String, ref: 'Category' },
    name_product: String,
    price_product: String,
    image: { type: String, required: [true, 'Hình ảnh sản phẩm là bắt buộc'] },
    describe: String,
    gender: String,
    // number: Number,  ← BỊ COMMENT, KHÔNG SỬ DỤNG!
});
```

#### 2. **Controller KHÔNG Xử Lý Tồn Kho**
```javascript
// server_app/API/Controller/detail_order.controller.js
module.exports.post_detail_order = async (req, res) => {
    await Detail_Order.create(req.body);  // ← CHỈ TẠO ĐƠN HÀNG
    res.send('Thanh Cong');               // ← KHÔNG TRỪ SỐ LƯỢNG!
};
```

#### 3. **Admin Panel KHÔNG Quản Lý Số Lượng**
```javascript
// server_app/API/Controller/admin/product.controller.js
module.exports.create = async (req, res) => {
    var newProduct = new Product();
    newProduct.name_product = req.body.name;
    newProduct.price_product = req.body.price;
    // newProduct.number = req.body.number;  ← BỊ COMMENT
    // ... không có trường số lượng
    newProduct.save();
};
```

---

## 🚨 Hậu Quả Nghiêm Trọng

### **Vấn Đề Kinh Doanh:**
1. ❌ **Bán vượt quá tồn kho** - Khách đặt 100 sản phẩm nhưng thực tế chỉ có 10
2. ❌ **Không biết sản phẩm nào hết hàng** - Vẫn hiển thị "Add to Cart"
3. ❌ **Không thể lập kế hoạch nhập hàng** - Không có báo cáo tồn kho
4. ❌ **Mất uy tín** - Khách đặt hàng rồi mới báo "hết hàng"
5. ❌ **Khó kiểm tra** - Không thống kê được hàng bán/tồn

### **Vấn Đề Kỹ Thuật:**
1. ❌ Không có validation số lượng
2. ❌ Không có transaction (nếu nhiều người mua cùng lúc)
3. ❌ Không có thông báo "Out of Stock"
4. ❌ Không có lịch sử nhập/xuất kho

---

## ✅ Giải Pháp Đề Xuất - TRIỂN KHAI NGAY

### **Cấp độ 1: CƠ BẢN (Bắt buộc - Ưu tiên cao)**

#### 1.1. Enable Field `number` trong Product Model
```javascript
// server_app/Models/product.js
var schema = new mongoose.Schema({
    id_category: { type: String, ref: 'Category' },
    name_product: String,
    price_product: String,
    image: { type: String, required: [true, 'Hình ảnh sản phẩm là bắt buộc'] },
    describe: String,
    gender: String,
    number: {                          // ← ENABLE LẠI
        type: Number,
        default: 0,
        min: [0, 'Số lượng không thể âm']
    }
});
```

#### 1.2. Update Admin - Thêm/Sửa Số Lượng
```javascript
// server_app/API/Controller/admin/product.controller.js
module.exports.create = async (req, res) => {
    const product = await Product.find();
    const productFilter = product.filter((c) => {
        return c.name_product.toUpperCase() === req.body.name.toUpperCase().trim();
    });

    if (productFilter.length > 0) {
        return res.json({ msg: 'Sản phẩm đã tồn tại' });
    }

    var newProduct = new Product();
    newProduct.name_product = req.body.name;
    newProduct.price_product = req.body.price;
    newProduct.id_category = req.body.category;
    newProduct.number = req.body.number || 0;  // ← THÊM SỐ LƯỢNG
    newProduct.describe = req.body.description;
    newProduct.gender = req.body.gender;

    // ... xử lý upload ảnh ...

    await newProduct.save();
    res.json({ msg: 'Thêm sản phẩm thành công' });
};

module.exports.update = async (req, res) => {
    const product = await Product.findOne({ _id: req.body.id });
    
    if (!product) {
        return res.json({ msg: 'Không tìm thấy sản phẩm' });
    }

    product.name_product = req.body.name;
    product.price_product = req.body.price;
    product.id_category = req.body.category;
    product.number = req.body.number;  // ← CẬP NHẬT SỐ LƯỢNG
    product.describe = req.body.description;
    product.gender = req.body.gender;

    // ... xử lý upload ảnh ...

    await product.save();
    res.json({ msg: 'Cập nhật thành công' });
};
```

#### 1.3. TRỪ TỒN KHO KHI ĐẶT HÀNG (QUAN TRỌNG NHẤT!)
```javascript
// server_app/API/Controller/detail_order.controller.js
const Product = require('../../Models/product');

module.exports.post_detail_order = async (req, res) => {
    try {
        const { id_product, count } = req.body;

        // ✅ Kiểm tra sản phẩm tồn tại
        const product = await Product.findById(id_product);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                msg: 'Sản phẩm không tồn tại' 
            });
        }

        // ✅ Kiểm tra tồn kho
        if (product.number < count) {
            return res.status(400).json({ 
                success: false, 
                msg: `Không đủ hàng! Chỉ còn ${product.number} sản phẩm` 
            });
        }

        // ✅ Trừ tồn kho
        product.number -= count;
        await product.save();

        // ✅ Tạo detail order
        await Detail_Order.create(req.body);

        res.json({ 
            success: true, 
            msg: 'Đặt hàng thành công',
            remaining: product.number 
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            success: false, 
            msg: 'Lỗi server' 
        });
    }
};
```

#### 1.4. Hiển thị Tồn Kho trên Frontend
```javascript
// client_app/src/DetailProduct/DetailProduct.jsx
// Thêm check tồn kho trước khi cho phép Add to Cart

const [product, setProduct] = useState({});
const [isOutOfStock, setIsOutOfStock] = useState(false);

useEffect(() => {
    const fetchProduct = async () => {
        const response = await ProductAPI.getDetail(id);
        setProduct(response);
        setIsOutOfStock(response.number === 0);
    };
    fetchProduct();
}, [id]);

// Trong JSX:
{isOutOfStock ? (
    <button className="btn btn-secondary" disabled>
        Hết hàng
    </button>
) : (
    <button 
        className="btn btn-primary" 
        onClick={handler_AddCart}
        disabled={product.number < count}
    >
        Thêm vào giỏ ({product.number} sản phẩm có sẵn)
    </button>
)}
```

---

### **Cấp độ 2: NÂNG CAO (Khuyến nghị)**

#### 2.1. Validation Số Lượng trong Giỏ Hàng
```javascript
// client_app/src/Cart/Cart.jsx
const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
        // ✅ Check tồn kho trước khi update
        const product = await ProductAPI.getDetail(productId);
        
        if (newQuantity > product.number) {
            alert(`Chỉ còn ${product.number} sản phẩm!`);
            return;
        }

        // Update cart
        updateCartItem(productId, newQuantity);
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
};
```

#### 2.2. API Check Tồn Kho
```javascript
// server_app/API/Controller/product.controller.js
module.exports.checkStock = async (req, res) => {
    const { productId, quantity } = req.query;
    
    const product = await Product.findById(productId);
    
    if (!product) {
        return res.json({ available: false, msg: 'Sản phẩm không tồn tại' });
    }

    res.json({
        available: product.number >= quantity,
        stock: product.number,
        msg: product.number >= quantity 
            ? 'Còn hàng' 
            : `Chỉ còn ${product.number} sản phẩm`
    });
};
```

#### 2.3. Badge "Sắp hết hàng"
```javascript
// client_app/src/Shop/Component/Products.jsx
const StockBadge = ({ stock }) => {
    if (stock === 0) return <span className="badge bg-danger">Hết hàng</span>;
    if (stock < 5) return <span className="badge bg-warning">Chỉ còn {stock}</span>;
    return <span className="badge bg-success">Còn hàng</span>;
};

// Hiển thị trong product card
<StockBadge stock={product.number} />
```

---

### **Cấp độ 3: CHUYÊN NGHIỆP (Mở rộng sau)**

#### 3.1. Báo Cáo Tồn Kho (Admin Dashboard)
```javascript
// server_app/API/Controller/admin/report.controller.js
module.exports.inventoryReport = async (req, res) => {
    const products = await Product.find().populate('id_category');

    const report = {
        totalProducts: products.length,
        outOfStock: products.filter(p => p.number === 0).length,
        lowStock: products.filter(p => p.number > 0 && p.number < 5).length,
        inStock: products.filter(p => p.number >= 5).length,
        products: products.map(p => ({
            name: p.name_product,
            category: p.id_category?.category,
            stock: p.number,
            status: p.number === 0 ? 'Out of Stock' : 
                    p.number < 5 ? 'Low Stock' : 'In Stock'
        }))
    };

    res.json(report);
};
```

#### 3.2. Lịch Sử Nhập/Xuất Kho
```javascript
// server_app/Models/inventory_transaction.js
var schema = new mongoose.Schema({
    id_product: { type: String, ref: 'Products', required: true },
    type: { 
        type: String, 
        enum: ['import', 'export', 'adjust'],
        required: true 
    },
    quantity: { type: Number, required: true },
    previous_stock: { type: Number, required: true },
    new_stock: { type: Number, required: true },
    reference: { type: String },  // ID đơn hàng hoặc phiếu nhập
    note: String,
    created_by: { type: String, ref: 'User' },
    created_at: { type: Date, default: Date.now }
});
```

#### 3.3. Nhập Hàng Hàng Loạt
```javascript
// server_app/API/Controller/admin/inventory.controller.js
module.exports.bulkImport = async (req, res) => {
    const { products } = req.body;  // [{ id_product, quantity }]
    
    const results = [];
    
    for (const item of products) {
        const product = await Product.findById(item.id_product);
        
        if (product) {
            const oldStock = product.number;
            product.number += item.quantity;
            await product.save();
            
            // Log transaction
            await InventoryTransaction.create({
                id_product: product._id,
                type: 'import',
                quantity: item.quantity,
                previous_stock: oldStock,
                new_stock: product.number,
                created_by: req.user._id
            });
            
            results.push({ 
                product: product.name_product, 
                success: true 
            });
        }
    }
    
    res.json({ results });
};
```

#### 3.4. Cảnh Báo Sắp Hết Hàng (Admin)
```javascript
// server_app/API/Controller/admin/notification.controller.js
module.exports.getLowStockAlerts = async (req, res) => {
    const threshold = req.query.threshold || 5;
    
    const lowStockProducts = await Product.find({
        number: { $lte: threshold, $gt: 0 }
    }).populate('id_category');

    res.json({
        count: lowStockProducts.length,
        products: lowStockProducts.map(p => ({
            id: p._id,
            name: p.name_product,
            category: p.id_category?.category,
            stock: p.number,
            urgency: p.number <= 2 ? 'high' : 'medium'
        }))
    });
};
```

---

## 📋 Kế Hoạch Triển Khai

### **Phase 1: Khẩn Cấp (1-2 ngày)** ⚡
- [ ] Enable field `number` trong Product model
- [ ] Update Admin panel: thêm input số lượng
- [ ] Implement trừ tồn kho khi đặt hàng
- [ ] Validation: không cho đặt quá số lượng tồn
- [ ] Test đầy đủ flow: Add product → Order → Check stock

### **Phase 2: Cải Thiện UX (3-4 ngày)** 📱
- [ ] Hiển thị số lượng còn lại trên product detail
- [ ] Badge "Hết hàng" / "Chỉ còn X" trên product card
- [ ] Disable button "Add to Cart" khi hết hàng
- [ ] Validation trong giỏ hàng (check real-time)
- [ ] Alert khi số lượng thay đổi trong lúc checkout

### **Phase 3: Admin Tools (1 tuần)** 🛠️
- [ ] Báo cáo tồn kho (dashboard)
- [ ] Trang quản lý nhập hàng
- [ ] Lịch sử xuất/nhập kho
- [ ] Cảnh báo sắp hết hàng
- [ ] Export Excel báo cáo

### **Phase 4: Advanced (2 tuần)** 🚀
- [ ] Transaction lock (prevent race condition)
- [ ] Đặt hàng trước (pre-order) khi hết hàng
- [ ] Tự động gửi email cảnh báo cho admin
- [ ] API webhook khi sản phẩm hết hàng
- [ ] Dự báo tồn kho dựa trên lịch sử bán

---

## 🎯 Tóm Tắt

| Tiêu chí | Trạng thái | Đánh giá |
|----------|-----------|----------|
| **Quản lý tồn kho** | ❌ KHÔNG CÓ | Nghiêm trọng |
| **Trừ số lượng khi bán** | ❌ KHÔNG CÓ | Nghiêm trọng |
| **Validation số lượng** | ❌ KHÔNG CÓ | Nghiêm trọng |
| **Hiển thị tồn kho** | ❌ KHÔNG CÓ | Cao |
| **Báo cáo kho** | ❌ KHÔNG CÓ | Trung bình |
| **Lịch sử nhập/xuất** | ❌ KHÔNG CÓ | Trung bình |

### **Kết luận:**
Đồ án hiện tại **KHÔNG CÓ hệ thống quản lý tồn kho**. Đây là **thiếu sót nghiêm trọng** đối với một website bán hàng thực tế. 

**Khuyến nghị:**
1. ✅ **Triển khai ngay Phase 1** (bắt buộc)
2. ✅ **Thêm test cases** cho inventory management
3. ✅ **Document API** cho tính năng mới
4. ✅ **Thêm vào Test Plan** như một test scenario quan trọng

---

**Tác giả:** GitHub Copilot  
**Ngày:** November 6, 2025  
**Mục đích:** Đánh giá và đề xuất cải tiến cho đồ án KTPM
