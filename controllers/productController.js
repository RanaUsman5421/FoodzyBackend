const Product = require('../models/product');

// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

exports.getProductBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;

        const product = await Product.findOne({ slug });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// Get all products with pagination
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || DEFAULT_PAGE;
        const limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
        const skip = (page - 1) * limit;

        const total = await Product.countDocuments();
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Search products with pagination and filters
exports.searchProducts = async (req, res) => {
    try {
        const { query, category } = req.query;
        const page = parseInt(req.query.page) || DEFAULT_PAGE;
        const limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
        const skip = (page - 1) * limit;

        let searchCriteria = {};

        // If there's a search query, use regex for flexible matching
        if (query && query.trim()) {
            searchCriteria.$or = [
                { product_name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        // If category is selected (not empty)
        if (category && category.trim() && category !== 'All Categories') {
            searchCriteria.category = { $regex: category, $options: 'i' };
        }

        const total = await Product.countDocuments(searchCriteria);
        const products = await Product.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}
