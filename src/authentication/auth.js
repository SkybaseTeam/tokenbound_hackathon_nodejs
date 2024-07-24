import jwt from 'jsonwebtoken';
import { getToken } from '../utils/index.js';

const checkToken = (req, res, next) => {
  const requestUrl = req.url.toLowerCase();
  if (
    (requestUrl.includes('/game') && !requestUrl.includes('/login')) ||
    requestUrl === '/tba/upload'
  ) {
    const token = getToken(req);
    try {
      jwt.verify(token, process.env.JWT_KEY);
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Token is expired' });
      } else {
        res.status(400).json({ message: 'Invalid token' });
      }
    }
  } else {
    next();
  }
};

export default checkToken;
