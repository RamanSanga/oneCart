import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const token = req.cookies.adminToken;  // <-- MUST MATCH NEW COOKIE

  if (!token) {
    return res.status(401).json({ message: "Admin not authenticated" });
  }

  try {
    jwt.verify(token, process.env.ADMIN_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid admin token" });
  }
};

export default adminAuth;

