require('dotenv').config();
const User = require('../models/User');
const Product = require('../models/product');
const Order = require('../models/Order');

// Helper to calculate order total
const calculateOrderTotal = (order) => {
    if (!order.items || order.items.length === 0) return 0;
    return order.items.reduce((total, item) => {
        const price = item.product?.discount_price || 0;
        return total + (price * item.quantity);
    }, 0);
};

// Admin login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const bcrypt = require('bcrypt');

    try {
        // Hardcoded admin credentials (in production, use environment variables)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@foodzy.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (email === adminEmail && password === adminPassword) {
            req.session.adminId = 'admin';
            req.session.isAdmin = true;
            return res.json({ success: true, message: 'Admin login successful' });
        }

        // Check if user exists and is admin
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isAdmin) {
            return res.json({ success: false, message: 'Access denied. Admin only.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        req.session.adminId = user._id;
        req.session.isAdmin = true;

        return res.json({ success: true, message: 'Admin login successful' });
    } catch (error) {
        console.error('Admin login error:', error);
        return res.json({ success: false, message: 'Login failed' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        console.error('Get users error:', error);
        res.json({ success: false, message: 'Failed to fetch users' });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Get user error:', error);
        res.json({ success: false, message: 'Failed to fetch user' });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, isAdmin, isBlocked } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (email) user.email = email;
        if (typeof isAdmin === 'boolean') user.isAdmin = isAdmin;
        if (typeof isBlocked === 'boolean') user.isBlocked = isBlocked;

        await user.save();
        res.json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
        console.error('Update user error:', error);
        res.json({ success: false, message: 'Failed to update user' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.json({ success: false, message: 'Failed to delete user' });
    }
};

// Block/Unblock user
exports.toggleUserBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isBlocked } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        user.isBlocked = isBlocked;
        await user.save();

        res.json({ 
            success: true, 
            message: isBlocked ? 'User blocked successfully' : 'User unblocked successfully' 
        });
    } catch (error) {
        console.error('Toggle block error:', error);
        res.json({ success: false, message: 'Failed to update user status' });
    }
};

// Make user admin
exports.makeAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        user.isAdmin = true;
        await user.save();

        res.json({ success: true, message: 'User is now an admin' });
    } catch (error) {
        console.error('Make admin error:', error);
        res.json({ success: false, message: 'Failed to make user admin' });
    }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        // Get recent orders with populated user
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'firstname lastname email')
            .populate('items.product', 'product_name discount_price');

        // Calculate totals for orders
        const ordersWithTotal = recentOrders.map(order => ({
            ...order.toObject(),
            total: calculateOrderTotal(order)
        }));

        // Get blocked users count
        const blockedUsers = await User.countDocuments({ isBlocked: true });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                blockedUsers,
                activeUsers: totalUsers - blockedUsers
            },
            recentOrders: ordersWithTotal
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};

// Get all products (admin view)
exports.getAllProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.error('Get products error:', error);
        res.json({ success: false, message: 'Failed to fetch products' });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        await Product.findByIdAndDelete(id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.json({ success: false, message: 'Failed to delete product' });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'firstname lastname email')
            .populate('items.product', 'product_name discount_price');
        
        // Calculate totals
        const ordersWithTotal = orders.map(order => ({
            ...order.toObject(),
            total: calculateOrderTotal(order)
        }));
        
        res.json({ success: true, orders: ordersWithTotal });
    } catch (error) {
        console.error('Get orders error:', error);
        res.json({ success: false, message: 'Failed to fetch orders' });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status - convert to lowercase to match enum values
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (status) {
            const normalizedStatus = status.toLowerCase();
            if (!validStatuses.includes(normalizedStatus)) {
                return res.json({ 
                    success: false, 
                    message: `Invalid status. Valid values are: ${validStatuses.join(', ')}` 
                });
            }
        }

        // Check if order exists
        const orderExists = await Order.findById(id);
        if (!orderExists) {
            return res.json({ success: false, message: 'Order not found' });
        }

        // Use findByIdAndUpdate to update only the status field without triggering full validation
        const order = await Order.findByIdAndUpdate(
            id,
            { status: status.toLowerCase() },
            { new: true, runValidators: true }
        );

        res.json({ success: true, message: 'Order status updated', order });
    } catch (error) {
        console.error('Update order error:', error);
        res.json({ success: false, message: 'Failed to update order' });
    }
};

// Admin logout
exports.adminLogout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ success: false, message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logged out successfully' });
    });
};

// Check admin session
exports.checkAdminAuth = async (req, res) => {
    if (req.session.isAdmin) {
        return res.json({ success: true, isAdmin: true });
    }
    res.json({ success: false, isAdmin: false });
};

// Create new product
exports.createProduct = async (req, res) => {
    try {
        const { product_name, category, discount_price, old_price, description, stock, rating } = req.body;

        // Validate required fields
        if (!product_name || !category || !discount_price) {
            return res.json({ success: false, message: 'Product name, category, and price are required' });
        }

        // Check if product with same name exists
        const existingProduct = await Product.findOne({ product_name });
        if (existingProduct) {
            return res.json({ success: false, message: 'Product with this name already exists' });
        }

        // Get image path if uploaded
        const image = req.file ? `/uploads/Images/${req.file.filename}` : '';

        const newProduct = new Product({
            product_name,
            category,
            image,
            discount_price: parseFloat(discount_price),
            old_price: old_price ? parseFloat(old_price) : 0,
            description: description || '',
            stock: stock ? parseInt(stock) : 0,
            rating: rating ? parseFloat(rating) : 0
        });

        await newProduct.save();

        res.json({ 
            success: true, 
            message: 'Product created successfully', 
            product: newProduct 
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.json({ success: false, message: 'Failed to create product' });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error('Get product error:', error);
        res.json({ success: false, message: 'Failed to fetch product' });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, category, discount_price, old_price, description, stock, rating } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        // Check if product name is being changed and if it already exists
        if (product_name && product_name !== product.product_name) {
            const existingProduct = await Product.findOne({ product_name });
            if (existingProduct) {
                return res.json({ success: false, message: 'Product with this name already exists' });
            }
            product.product_name = product_name;
        }

        if (category) product.category = category;
        if (discount_price) product.discount_price = parseFloat(discount_price);
        if (old_price !== undefined) product.old_price = parseFloat(old_price);
        if (description !== undefined) product.description = description;
        if (stock !== undefined) product.stock = parseInt(stock);
        if (rating !== undefined) product.rating = parseFloat(rating);

        // Update image if new file uploaded
        if (req.file) {
            product.image = `/uploads/Images/${req.file.filename}`;
        }

        await product.save();

        res.json({ 
            success: true, 
            message: 'Product updated successfully', 
            product 
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.json({ success: false, message: 'Failed to update product' });
    }
};
