const express = require('express');
const { verifyAuth, verifyOwnership } = require('../middleware/verifyAuth');
const { strictLimiter } = require('../middleware/rateLimiter');
const { validateProfileUpdate, validateMongoIdParam } = require('../middleware/validators');
const {
  getMyProfile,
  updateMyProfile,
  getDashboard,
  getUserById,
} = require('../controllers/userController');

const router = express.Router();

// All routes below require a valid better-auth JWT
router.use(verifyAuth);

router.get('/dashboard', getDashboard);

router.get('/profile', getMyProfile);

router.put(
  '/profile',
  strictLimiter,          // tighter limit - profile edits shouldn't be hammered
  validateProfileUpdate,  // sanitizes + validates name/bio/image
  updateMyProfile
);

// :id must equal the logged-in user's own id - verifyOwnership blocks the rest
router.get(
  '/users/:id',
  strictLimiter,
  validateMongoIdParam,
  verifyOwnership,
  getUserById
);

module.exports = router;