const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: [true, 'Product name is required'],
        minlength: [2, 'Product name must be at least 2 characters'],
        maxlength: [100, 'Product name cannot exceed 100 characters'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        minlength: [2, 'Category must be at least 2 characters'],
        maxlength: [50, 'Category cannot exceed 50 characters'],
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    discount_price: {
        type: Number,
        required: [true, 'Discount price is required'],
        min: [0, 'Price cannot be negative']
    },
    old_price: {
        type: Number,
        default: 0,
        min: [0, 'Old price cannot be negative']
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot exceed 5']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-generate slug before saving
productSchema.pre('save', function(next) {
    try {
        if (this.isModified('product_name') && this.product_name) {
            this.slug = slugify(this.product_name, { lower: true, strict: true });
        }
    } catch (error) {
        return error;
    }
});

// Index for faster queries
productSchema.index({ category: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ product_name: 'text' });

module.exports = mongoose.model("Product", productSchema);
