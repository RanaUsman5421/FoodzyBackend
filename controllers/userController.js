require('dotenv').config();
const path = require("path");
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        console.log(firstname,lastname,email,password);
        const usercheck = await User.findOne({ firstname });
        if (usercheck) {
            res.send("User Already Exists");
        }
        else {

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                firstname,
                lastname,
                email,
                password: hashedPassword,
            });

            await newUser.save();

            res.sendFile(path.join(__dirname, '../public', 'login.html'));
        }


    } catch (error) {
        res.status(500).send("Error saving data");
        console.log(error);
    }
};








const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                  // 5 login attempts per IP
    message: {
        success: false,
        message: 'Too many login attempts. Try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Request headers:', req.headers);
    console.log('Session ID before login:', req.sessionID);

    try {
        // Normalize email to lowercase for consistent lookup
        const normalizedEmail = email.toLowerCase().trim();
        console.log('Normalized email:', normalizedEmail);

        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }

        console.log('User found:', user.email);
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Set session userId
        req.session.userId = user._id;
        console.log('Session userId set:', req.session.userId);
        console.log('Session ID:', req.session.id);
        
        // Save session explicitly
req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ success: false, message: 'Session error' });
            }
            console.log('Session saved successfully');
            
            // Log successful login
            console.log('=== LOGIN SUCCESSFUL ===');
            console.log('User ID:', user._id);
            console.log('Email:', user.email);
            console.log('Session ID:', req.session.id);
            console.log('============================');
            
            // Respond with JSON for AJAX/fetch login
            return res.json({ success: true, redirect: '/shop.html' });
        });
    } catch(error){
        console.error('=== LOGIN ERROR (Server) ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        console.error('================================');
        return res.status(500).json({ success: false, message: 'Login Failed: ' + error.message });
    }
}




// app.delete('/api/user/:email', async (req, res) =>{
//     const userEmail = req.params.email;

//     const userExist = await User.findOne({email: userEmail});
//     if(userExist){
//         const user = await User.findOneAndDelete({email: userEmail});

//         res.json({
//             success: true,
//             message: "User Deleted",
//             data: user
//         })
//     }
//     else{
//         res.json({message: "UserDoes not Exist"})
//     }
// })