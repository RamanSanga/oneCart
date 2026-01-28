import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    console.log(">>> isAuth: req.headers.cookie:", req.headers.cookie);
    console.log(">>> isAuth: req.cookies object:", req.cookies);
    console.log(">>> isAuth: authorization header:", req.headers.authorization);

    const token = req.cookies?.token;

    if (!token) {
      console.warn("isAuth: no token found on request");
      return res.status(401).json({ message: "No token. Unauthorized user" });
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("isAuth: verifiedToken:", verifiedToken);

    // ===============================
    // PRIMARY: userId in token
    // ===============================
    if (verifiedToken.userId || verifiedToken.id || verifiedToken._id) {
      req.userId =
        verifiedToken.userId ||
        verifiedToken.id ||
        verifiedToken._id;

      return next();
    }

    // ===============================
    // FALLBACK: email in token
    // ===============================
    if (verifiedToken.email) {
      req.userEmail = verifiedToken.email;

      const user = await User.findOne({ email: verifiedToken.email }).select("_id");

      if (!user) {
        return res.status(401).json({ message: "User not found from token email" });
      }

      // 🔥 THIS FIXES EVERYTHING
      req.userId = user._id;

      console.log("isAuth: resolved userId from email:", req.userId);

      return next();
    }

    console.warn("isAuth: token payload missing userId and email");
    return res.status(401).json({ message: "Invalid token payload" });

  } catch (error) {
    console.error("isAuth Error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};
