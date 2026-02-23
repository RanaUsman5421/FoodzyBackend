const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'First name can only contain letters'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Last name can only contain letters'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [5, 'Address must be at least 5 characters'],
        maxlength: [200, 'Address cannot exceed 200 characters'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        minlength: [2, 'City must be at least 2 characters'],
        maxlength: [50, 'City cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'City can only contain letters'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        minlength: [2, 'State must be at least 2 characters'],
        maxlength: [50, 'State cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'State can only contain letters'],
        trim: true
    },
    postcode: {
        type: String,
        required: [true, 'Postcode is required'],
        minlength: [3, 'Postcode must be at least 3 characters'],
        maxlength: [10, 'Postcode cannot exceed 10 characters'],
        match: [/^[a-zA-Z0-9\s-]+$/, 'Invalid postcode format'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        minlength: [2, 'Country must be at least 2 characters'],
        maxlength: [50, 'Country cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Country can only contain letters'],
        trim: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.product': 1 });

module.exports = mongoose.model("Order", orderSchema);
