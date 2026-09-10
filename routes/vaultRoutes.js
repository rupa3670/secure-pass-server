// routes/vaultRoutes.js
const express = require('express');
const { verifyAuth } = require('../middleware/verifyAuth');
const { strictLimiter } = require('../middleware/rateLimiter');
const { validateVaultEntry, validateMongoIdParam } = require('../middleware/validators');
const {
  getVaultEntries,
  addVaultEntry,
  updateVaultEntry,
  deleteVaultEntry,
} = require('../controllers/vaultController');

const router = express.Router();


router.use(verifyAuth); 

router.get('/vault', getVaultEntries);
router.post('/vault', strictLimiter, validateVaultEntry, addVaultEntry);
router.put('/vault/:id', strictLimiter, validateMongoIdParam, validateVaultEntry, updateVaultEntry);
router.delete('/vault/:id', strictLimiter, validateMongoIdParam, deleteVaultEntry);

module.exports = router;