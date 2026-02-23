const Subscription = require('../models/Sucbscriptions');
const transporter = require('../config/mailer');

exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is already subscribed
        const existing = await Subscription.findOne({ email: email.toLowerCase() });
        
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You are already subscribed'
            });
        }

        // Create new subscription
        const newSubscriber = new Subscription({ email: email.toLowerCase() });
        await newSubscriber.save();

        // Send welcome email
        try {
            await transporter.sendMail({
                from: `"Foodzy" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Welcome to Foodzy Newsletter! 🍔",
                html: `
                    <h2>Welcome to Foodzy! 💖</h2>
                    <p>Thank you for subscribing to our newsletter.</p>
                    <p>You'll now receive updates on:</p>
                    <ul>
                        <li>New menu items 🍕</li>
                        <li>Special discounts 💸</li>
                        <li>Exclusive offers 🎁</li>
                    </ul>
                    <p>We're happy to have you with us!</p>
                    <b>— Team Foodzy</b>
                `,
            });
        } catch (mailError) {
            console.error('Email sending error:', mailError);
            // Don't fail the subscription if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Subscribed Successfully!'
        });
    } catch (error) {
        console.error('Subscription Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again.'
        });
    }
};

exports.unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await Subscription.findOneAndDelete({ email: email.toLowerCase() });
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in subscriptions'
            });
        }

        res.json({
            success: true,
            message: 'Unsubscribed Successfully'
        });
    } catch (error) {
        console.error('Unsubscribe Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe'
        });
    }
};
