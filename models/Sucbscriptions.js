const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true 
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Subscription', subscriptionSchema);