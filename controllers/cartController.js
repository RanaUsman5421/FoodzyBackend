// controllers/cartController.js
const User = require("../models/User");

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;   // from auth middleware
    const productId = req.params.productId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(
      item => item.product !== productId
    );

    await user.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart: user.cart
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};