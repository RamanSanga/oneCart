import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    // read token from cookie or Authorization header
    const tokenFromCookie = req.cookies?.token;
    const authHeader = req.headers?.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      console.warn('adminAuth: no token provided');
      return res.status(401).json({ message: 'Not Authorized. Login again' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // payload may contain { email } (genToken1) or { userId } (genToken)
    if (decoded?.email) req.adminEmail = decoded.email;
    if (decoded?.userId) req.userId = decoded.userId;

    return next();
  } catch (error) {
    console.error('AdminAuth Error:', error);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

export default adminAuth;
