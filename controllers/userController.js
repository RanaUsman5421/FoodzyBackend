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

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        req.session.userId = user._id;

        // Respond with JSON for AJAX/fetch login
        return res.json({ success: true, redirect: '/shop.html' });
    } catch(error){
        console.log(error);
        return res.status(500).json({ success: false, message: 'Login Failed' });
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