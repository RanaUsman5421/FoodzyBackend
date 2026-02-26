const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/userController');
const upload = require('../middlewares/upload');
const singleUpload = require('../controllers/uploadController');
const Products = require('../models/product');
const { getProductBySlug, getAllProducts, searchProducts } = require('../controllers/productController');
const isAuth = require('../middlewares/isAuth');
const { removeFromCart } = require('../controllers/cartController');
const transporter = require('../config/mailer');
const bcrypt = require('bcrypt');
const { count } = require('console');

// Import validators
const { validateRegister, validateLogin } = require('../validators/userValidator');
const { validateOrder } = require('../validators/orderValidator');
const { validateSubscription } = require('../validators/subscriptionValidator');
const { validateProduct } = require('../validators/productValidator');

// Import controllers
const { placeOrder } = require('../controllers/orderController');
const { subscribe } = require('../controllers/subscriptionController');

// Import admin controller
const adminController = require('../controllers/adminController');

router.get('/page', (req, res) => {
  res.json({ message: "This is page route" });
})

// Optional API route
router.get("/api/message", (req, res) => {
  res.json({ message: "Hello from backend" });
});


// ======== ADMIN ROUTES ========

// Admin login page
router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

// Admin login
router.post('/api/admin/login', adminController.adminLogin);

// Admin logout
router.post('/api/admin/logout', adminController.adminLogout);

// Check admin auth
router.get('/api/admin/check-auth', adminController.checkAdminAuth);

// Dashboard stats
router.get('/api/admin/stats', adminController.getDashboardStats);

// User management
router.get('/api/admin/users', adminController.getAllUsers);
router.get('/api/admin/users/:id', adminController.getUserById);
router.put('/api/admin/users/:id', adminController.updateUser);
router.delete('/api/admin/users/:id', adminController.deleteUser);
router.post('/api/admin/users/:id/block', adminController.toggleUserBlock);
router.post('/api/admin/users/:id/make-admin', adminController.makeAdmin);

// Product management
router.get('/api/admin/products', adminController.getAllProductsAdmin);
router.get('/api/admin/products/:id', adminController.getProductById);
router.post('/api/admin/products', upload.single('image'), adminController.createProduct);
router.put('/api/admin/products/:id', upload.single('image'), adminController.updateProduct);
router.delete('/api/admin/products/:id', adminController.deleteProduct);

// Order management
router.get('/api/admin/orders', adminController.getAllOrders);
router.put('/api/admin/orders/:id', adminController.updateOrderStatus);


// ======== END ADMIN ROUTES ========


router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});


router.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'api.html'));
});


router.get('/image', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'img.html'));
});


router.get('/imgurl', (req, res) => {
  res.json({ imgUrl: 'uploads/samra.jpg' });
});



// API to send data to frontend
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});



// Single file route
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.json({
    message: 'File uploaded successfully',
    file: req.file
  });
});

// Get all products with pagination
router.get('/getproducts', getAllProducts)

// Search products API with pagination
router.get('/api/products/search', searchProducts)




// ====== PROTECTED ROUTE ======
router.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.status(401).send('Please login first');
  const user = await User.findById(req.session.userId).select('-password');
  console.log(user.firstname);
  res.send(`Welcome ${user.firstname}! <a href="/logout">Logout</a>`);
});


router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send("Error Logging Out");
    res.clearCookie('connect.sid');
    res.redirect('/login');
  })
})


router.post('/cart/add', isAuth, async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.session.userId);

  const item = user.cart.find(
    i => i.product.toString() === productId
  );

  if (item) {
    item.quantity += 1;
  } else {
    user.cart.push({ product: productId, quantity: 1 })
  }

  await user.save();

  res.json({ success: true });
})


router.get('/cart', isAuth, async (req, res) => {
  const user = await User.findById(req.session.userId).populate('cart.product');
  res.json(user.cart);
})

router.delete('/removeFromCart/:productId', async (req, res) => {
  const { productId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.session.userId,
    { $pull: { cart: { product: productId } } },
    { new: true }
  ).populate('cart.product');

  res.json({ cart: user.cart });
});


router.patch('/cart/update', async (req, res) => {
  try {
    const { productId, action } = req.body;

    const user = await User.findById(req.session.userId);

    const item = user.cart.find(
      i => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Increase / Decrease logic
    if (action === 'increase') {
      item.quantity += 1;
    } else if (action === 'decrease') {
      item.quantity -= 1;
    }

    // Remove item if quantity <= 0
    if (item.quantity <= 0) {
      user.cart = user.cart.filter(
        i => i.product.toString() !== productId
      );
    }

    await user.save();

    await user.populate('cart.product');

    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'checkout.html'));
});

router.get('/checkoutItems', async (req, res) => {
  const user = await User.findById(req.session.userId).populate('cart.product');
  res.json({ cart: user.cart });
})


// Subscribe route with validation
router.post('/subscribe', validateSubscription, subscribe);

router.get('/product/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'product.html'))
})

router.get('/api/product/:slug', async (req, res) => {
  const product = await Products.findOne({ slug: req.params.slug });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    product,
  });
});

router.post('/submit', validateRegister, registerUser);
router.post('/loginform', validateLogin, loginUser);

router.post('/send-code', async (req, res) => {

  const {firstname,lastname,email,password} = req.body;
  console.log(firstname,lastname,email,password);
  req.session.userData = {firstname,lastname,email,password};
  console.log(req.session.userData);

  const otp = Math.floor(100000 + Math.random() * 900000);
  req.session.otp = otp;
  console.log(req.session.otp);

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Email Verification Code`,
    html: `<h2>Your Email Verification Code</h2>
    <b>${otp}</b>
    <p>Enter this OTP to verify your email.</p>
    `
  })
  res.json({ success: true, message: "OTP Sent Successfully" })
})

router.post('/verify-code', async (req, res) => {
  const {firstname,lastname,email,password} = req.session.userData;
  console.log(req.session.userData);
  const {otp} = req.body;
  const welcomeMail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Welcome Email`,
    text: `Mr ${firstname} Welcome to Foodzy.`
  }
  if(parseInt(otp) === req.session.otp){
    const checkUser = await User.findOne({email});
    if(checkUser){
      return res.json({success: false, message: "User Exists Already"})
    }else{
      try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
          firstname,
          lastname,
          email,
          password: hashedPassword
        })

        await newUser.save();

        console.log("User Created Successfully");
        transporter.sendMail(welcomeMail)
        return res.json({success: true, message: "User Created Successfully"});
      }catch(err){
        return res.json({success: false, message: "User cannot be created"});
      }
    }
  }else{
    res.json({success: false, message: "OTP not Matched"});
  }
})

// Place order route with validation and controller
router.post('/place-order', validateOrder, placeOrder);

// Order success page
router.get('/order-success', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'order-success.html'));
});

// API to get current logged in user
router.get('/api/user', async (req, res) => {
  if (!req.session.userId) {
    return res.json({ loggedIn: false });
  }
  
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.json({ loggedIn: false });
    }
    res.json({ 
      loggedIn: true,
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (error) {
    res.json({ loggedIn: false });
  }
});

// ====== FORGOT PASSWORD ROUTES ======

// Get forgot password page
router.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'forgot-password.html'));
});

// Generate reset code and send email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.json({ success: false, message: 'User not found with this email address' });
    }
    
    // Generate 6-digit verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset code and expiry (15 minutes from now)
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    
    await user.save();
    
    // Send email with reset code
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password. Use the verification code below:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${resetCode}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };
    
    transporter.sendMail(mailOptions);
    
    // Store email in session for the reset page
    req.session.resetEmail = email;
    
    res.json({ success: true, message: 'Verification code sent to your email' });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.json({ success: false, message: 'An error occurred. Please try again.' });
  }
});

// Get reset password page
router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'reset-password.html'));
});

// Verify code and reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      resetPasswordToken: code,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.json({ success: false, message: 'Invalid or expired verification code' });
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    
    await user.save();
    
    // Clear session
    req.session.resetEmail = null;
    
    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p>Your password has been successfully reset.</p>
          <p>If you didn't make this change, please contact us immediately.</p>
        </div>
      `
    };
    
    transporter.sendMail(mailOptions);
    
    res.json({ success: true, message: 'Password reset successful. You can now login with your new password.' });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.json({ success: false, message: 'An error occurred. Please try again.' });
  }
});

module.exports = router;
