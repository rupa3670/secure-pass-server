const { ObjectId } = require('mongodb');
const crypto = require('crypto');

// GET /api/dashboard -> data for the logged-in user only
const getDashboard = async (req, res) => {
  const db = req.app.locals.db;
  const user = await db.collection("user").findOne({ email: req.user.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: `Welcome ${user.name || user.email}`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  });
};

// GET /api/profile -> logged-in user's own profile
const getMyProfile = async (req, res) => {
  const db = req.app.locals.db;
  const user = await db.collection("user").findOne({ email: req.user.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
};

// PUT /api/profile -> update own profile only (validated in route)
const updateMyProfile = async (req, res) => {
  const db = req.app.locals.db;
  const { name, bio, image } = req.body;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (bio !== undefined) updateFields.bio = bio;
  if (image !== undefined) updateFields.image = image;

  const result = await db.collection("user").findOneAndUpdate(
    { email: req.user.email },
    { $set: updateFields },
    { returnDocument: "after" }
  );

  if (!result) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "Profile updated", user: result });
};

// GET /api/users/:id -> only reachable if :id belongs to the requester
const getUserById = async (req, res) => {
  const db = req.app.locals.db;

  const user = await db.collection("user").findOne({ _id: new ObjectId(req.params.id) });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
};

// GET /api/user/vault-salt -> get or create this user's vault encryption salt
const getVaultSalt = async (req, res) => {
  const db = req.app.locals.db;
  const user = await db.collection("user").findOne({ email: req.user.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let vaultSalt = user.vaultSalt;

  if (!vaultSalt) {
    vaultSalt = crypto.randomBytes(16).toString("hex");
    await db.collection("user").updateOne(
      { email: req.user.email },
      { $set: { vaultSalt } }
    );
  }

  res.json({ vaultSalt });
};

module.exports = { getDashboard, getMyProfile, updateMyProfile, getUserById, getVaultSalt };