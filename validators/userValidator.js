const Joi = require('joi');

const registerSchema = Joi.object({
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
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase, lowercase, number, and special character',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Password is required',
    }),
});

// Middleware function to validate registration
exports.validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    // Log validation errors to console
    console.error('=== REGISTRATION VALIDATION ERROR ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Errors:', JSON.stringify(errors, null, 2));
    console.error('======================================');
    
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};

// Middleware function to validate login
exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    // Log validation errors to console
    console.error('=== LOGIN VALIDATION ERROR ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Errors:', JSON.stringify(errors, null, 2));
    console.error('================================');
    
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};
