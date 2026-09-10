const express = require('express');
const { verifyAuth } = require('../middleware/verifyAuth');
const { validateMongoIdParam } = require('../middleware/validators');
const {
  getDashboard,
  getMyProfile,
  updateMyProfile,
  getUserById,
  getVaultSalt,
} = require('../controllers/userController');

const router = express.Router();

router.use(verifyAuth); // sob user route protected

router.get('/dashboard', getDashboard);
router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.get('/users/:id', validateMongoIdParam, getUserById);
router.get('/user/vault-salt', getVaultSalt);

module.exports = router;