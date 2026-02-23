const Joi = require('joi');

const subscriptionSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
});

// Middleware function to validate subscription
exports.validateSubscription = (req, res, next) => {
  const { error } = subscriptionSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};
