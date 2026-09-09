const { body, param, validationResult } = require('express-validator');

// Runs after the validators below and turns any failure into a clean 400
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Validators for PUT /api/profile
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Name must be under 60 characters')
    .matches(/^[a-zA-Z0-9\s.'-]*$/)
    .withMessage('Name contains invalid characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Bio must be under 300 characters'),
  body('image')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image must be a valid URL'),
  handleValidation,
];

// Validator for routes with an :id param (e.g. GET /api/users/:id)
const validateMongoIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user id format'),
  handleValidation,
];

const validateVaultEntry = [
  body('siteName').trim().notEmpty().withMessage('Site name required').isLength({ max: 100 }),
  body('siteUrl').optional().trim().isURL().withMessage('Invalid URL'),
  body('username').trim().notEmpty().withMessage('Username required').isLength({ max: 100 }),
  body('encryptedPassword').trim().notEmpty().withMessage('Encrypted password required'),
  body('iv').trim().notEmpty().withMessage('IV required'),
  handleValidation,
];

module.exports = { validateProfileUpdate, validateMongoIdParam, validateVaultEntry };