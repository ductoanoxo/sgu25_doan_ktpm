const Product = require('../../../Models/product');
const { cloudinary, deleteImage, getPublicIdFromUrl } = require('../../../config/cloudinary');

module.exports.index = async(req, res) => {
    let page = parseInt(req.query.page) || 1;
    const keyWordSearch = req.query.search;

    const perPage = parseInt(req.query.limit) || 8;
    const totalPage = Math.ceil(await Product.countDocuments() / perPage);

    let start = (page - 1) * perPage;
    let end = page * perPage;

    const products = await Product.find().populate('id_category');


    if (!keyWordSearch) {
        res.json({
            products: products.slice(start, end),
            totalPage: totalPage
        });

    } else {
        var newData = products.filter(value => {
            return value.name_product.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                value.price_product.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                value.id.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1;
            // value.id_category.category.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1
        });

        res.json({
            products: newData.slice(start, end),
            totalPage: totalPage
        });
    }
};

module.exports.create = async(req, res) => {
    const product = await Product.find();

    const productFilter = product.filter((c) => {
        return c.name_product.toUpperCase() === req.body.name.toUpperCase().trim();
    });

    if (productFilter.length > 0) {
        res.json({ msg: 'Sản phẩm đã tồn tại' });
    } else {
        var newProduct = new Product();
        req.body.name = req.body.name.toLowerCase().replace(/^.|\s\S/g, a => { return a.toUpperCase(); });
        newProduct.name_product = req.body.name;
        newProduct.price_product = req.body.price;
        newProduct.id_category = req.body.category;
        newProduct.number = req.body.number || 0;
        newProduct.describe = req.body.description;
        newProduct.gender = req.body.gender;

        // Debug log
        console.log('=== CREATE PRODUCT DEBUG ===');
        console.log('req.files:', req.files);
        console.log('req.files.file:', req.files ? req.files.file : 'NO FILES');

        // Upload image to Cloudinary
        if (req.files && req.files.file) {
            try {
                const fileImage = req.files.file;
                
                console.log('File info:', {
                    name: fileImage.name,
                    size: fileImage.size,
                    mimetype: fileImage.mimetype
                });

                // Upload to Cloudinary using upload stream
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'fashion-shop/products',
                            resource_type: 'image',
                            transformation: [
                                { width: 1000, height: 1000, crop: 'limit' }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(fileImage.data);
                });

                newProduct.image = result.secure_url;
                console.log('✅ Uploaded to Cloudinary:', result.secure_url);
            } catch (error) {
                console.error('❌ Cloudinary upload error:', error);
                newProduct.image = 'https://via.placeholder.com/300x300?text=No+Image';
            }
        } else {
            console.log('⚠️ No file provided, using placeholder');
            newProduct.image = 'https://via.placeholder.com/300x300?text=No+Image';
        }

        await newProduct.save();
        res.json({ msg: 'Bạn đã thêm thành công' });
    }
};

module.exports.delete = async(req, res) => {
    const id = req.query.id;

    try {
        // Get product to delete image from Cloudinary
        const product = await Product.findById(id);
        if (product && product.image) {
            const publicId = getPublicIdFromUrl(product.image);
            if (publicId) {
                await deleteImage(publicId).catch(err => console.error('Error deleting image:', err));
            }
        }

        await Product.deleteOne({ _id: id });
        res.json({ msg: 'Thanh Cong' });
    } catch (err) {
        res.json({ msg: err.message });
    }
};

module.exports.details = async(req, res) => {
    const product = await Product.findOne({ _id: req.params.id });

    res.json(product);
};

module.exports.update = async(req, res) => {
    const product = await Product.find();

    const productFilter = product.filter((c) => {
        return c.name_product.toUpperCase() === req.body.name.toUpperCase().trim() && c.id !== req.body.id;
    });

    if (productFilter.length > 0) {
        res.json({ msg: 'Sản phẩm đã tồn tại' });
    } else {
        req.body.name = req.body.name.toLowerCase().replace(/^.|\s\S/g, a => { return a.toUpperCase(); });

        const updateData = {
            name_product: req.body.name,
            price_product: req.body.price,
            id_category: req.body.category,
            number: req.body.number,
            describe: req.body.description,
            gender: req.body.gender
        };

        // Upload new image to Cloudinary if provided
        if (req.files && req.files.file) {
            try {
                const fileImage = req.files.file;
                
                // Get old product to delete old image from Cloudinary
                const oldProduct = await Product.findById(req.body.id);
                if (oldProduct && oldProduct.image) {
                    const publicId = getPublicIdFromUrl(oldProduct.image);
                    if (publicId) {
                        await deleteImage(publicId).catch(err => console.error('Error deleting old image:', err));
                    }
                }

                // Upload new image to Cloudinary
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'fashion-shop/products',
                            resource_type: 'image',
                            transformation: [
                                { width: 1000, height: 1000, crop: 'limit' }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(fileImage.data);
                });

                updateData.image = result.secure_url;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                return res.json({ msg: 'Lỗi upload hình ảnh' });
            }
        }

        await Product.updateOne({ _id: req.body.id }, updateData);
        res.json({ msg: 'Bạn đã update thành công' });
    }
};