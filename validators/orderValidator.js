const Joi = require('joi');

const orderSchema = Joi.object({
  firstname: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters',
    }),
  lastname: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters',
    }),
  address: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address cannot exceed 200 characters',
    }),
  city: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'City is required',
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City cannot exceed 50 characters',
      'string.pattern.base': 'City can only contain letters',
    }),
  state: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'State is required',
      'string.min': 'State must be at least 2 characters',
      'string.max': 'State cannot exceed 50 characters',
      'string.pattern.base': 'State can only contain letters',
    }),
  postcode: Joi.string()
    .min(3)
    .max(10)
    .pattern(/^[a-zA-Z0-9\s-]+$/)
    .required()
    .messages({
      'string.empty': 'Postcode is required',
      'string.min': 'Postcode must be at least 3 characters',
      'string.max': 'Postcode cannot exceed 10 characters',
      'string.pattern.base': 'Invalid postcode format',
    }),
  country: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'Country is required',
      'string.min': 'Country must be at least 2 characters',
      'string.max': 'Country cannot exceed 50 characters',
      'string.pattern.base': 'Country can only contain letters',
    }),
  items: Joi.array()
    .min(1)
    .required()
    .messages({
      'array.min': 'Cart cannot be empty',
    }),
});

// Middleware function to validate order
exports.validateOrder = (req, res, next) => {
  const { error } = orderSchema.validate(req.body, { abortEarly: false });
  
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
