// controllers/vaultController.js
const { ObjectId } = require('mongodb');

// GET /api/vault -> all entries for logged-in user (optional ?search=)
const getVaultEntries = async (req, res) => {
  const db = req.app.locals.db;
  const { search } = req.query;

  const filter = { userId: req.user.id };
  if (search) {
    filter.$or = [
      { siteName: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
    ];
  }

  const entries = await db
    .collection('vault')
    .find(filter)
    .sort({ updatedAt: -1 })
    .toArray();

  res.json({ entries });
};

// POST /api/vault -> add new credential (already encrypted client-side)
const addVaultEntry = async (req, res) => {
  const db = req.app.locals.db;
  const { siteName, siteUrl, username, encryptedPassword, iv } = req.body;

  const entry = {
    userId: req.user.id,
    siteName,
    siteUrl: siteUrl || '',
    username,
    encryptedPassword, // ciphertext only, base64 string
    iv,                 // AES-GCM iv, base64 string, unique per entry
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('vault').insertOne(entry);
  res.status(201).json({ message: 'Entry saved', id: result.insertedId });
};

// PUT /api/vault/:id -> edit own entry only
const updateVaultEntry = async (req, res) => {
  const db = req.app.locals.db;
  const { siteName, siteUrl, username, encryptedPassword, iv } = req.body;

  const updateFields = { updatedAt: new Date() };
  if (siteName !== undefined) updateFields.siteName = siteName;
  if (siteUrl !== undefined) updateFields.siteUrl = siteUrl;
  if (username !== undefined) updateFields.username = username;
  if (encryptedPassword !== undefined) updateFields.encryptedPassword = encryptedPassword;
  if (iv !== undefined) updateFields.iv = iv;

  const result = await db.collection('vault').findOneAndUpdate(
    { _id: new ObjectId(req.params.id), userId: req.user.id }, // ownership check inline
    { $set: updateFields },
    { returnDocument: 'after' }
  );

  if (!result) {
    return res.status(404).json({ message: 'Entry not found' });
  }

  res.json({ message: 'Entry updated', entry: result });
};

// DELETE /api/vault/:id -> delete own entry only
const deleteVaultEntry = async (req, res) => {
  const db = req.app.locals.db;

  const result = await db.collection('vault').deleteOne({
    _id: new ObjectId(req.params.id),
    userId: req.user.id,
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Entry not found' });
  }

  res.json({ message: 'Entry deleted' });
};

module.exports = { getVaultEntries, addVaultEntry, updateVaultEntry, deleteVaultEntry };