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

router.get('/page', (req, res) => {
  res.json({ message: "This is page route" });
})

// Optional API route
router.get("/api/message", (req, res) => {
  res.json({ message: "Hello from backend" });
});


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

module.exports = router;
