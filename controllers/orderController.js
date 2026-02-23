const Order = require('../models/Order');
const User = require('../models/User');

exports.placeOrder = async (req, res) => {
    try {
        const { firstname, lastname, address, city, state, postcode, country } = req.body;
        
        // Get user and populate cart items
        const user = await User.findById(req.session.userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Please login to place an order'
            });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty'
            });
        }

        // Create new order
        const newOrder = new Order({
            firstname,
            lastname,
            address,
            city,
            state,
            postcode,
            country,
            items: user.cart
        });

        await newOrder.save();

        // Clear user's cart after successful order
        user.cart = [];
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Order Received Successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order. Please try again.'
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'items.product': { $in: req.session.userId } })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};
