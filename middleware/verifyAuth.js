// middleware/verifyAuth.js
const { createRemoteJWKSet, jwtVerify } = require('jose');

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.BETTER_AUTH_URL}/api/auth/jwks`)
);

const verifyAuth = async (req, res, next) =>{
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, JWKS);
    req.user = { id: payload.sub || payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


const verifyOwnership = (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return res.status(403).json({ message: "Forbidden — not your resource" });
  }
  next();
};

module.exports = { verifyAuth, verifyOwnership }; 