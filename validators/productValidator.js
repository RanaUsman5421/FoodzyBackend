const Joi = require('joi');

const productSchema = Joi.object({
  product_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters',
      'string.max': 'Product name cannot exceed 100 characters',
    }),
  category: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Category is required',
      'string.min': 'Category must be at least 2 characters',
      'string.max': 'Category cannot exceed 50 characters',
    }),
  discount_price: Joi.number()
    .positive()
    .required()
    .messages({
      'number.empty': 'Discount price is required',
      'number.positive': 'Discount price must be a positive number',
    }),
  old_price: Joi.number()
    .positive()
    .allow('')
    .messages({
      'number.positive': 'Old price must be a positive number',
    }),
  rating: Joi.string()
    .pattern(/^[0-5]$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Rating must be between 0 and 5',
    }),
  image: Joi.string()
    .allow('')
    .messages({
      'string.base': 'Image must be a string',
    }),
  slug: Joi.string()
    .allow('')
    .messages({
      'string.base': 'Slug must be a string',
    }),
});

// Middleware function to validate product
exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body, { abortEarly: false });
  
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
