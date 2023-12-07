import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default function resLocals(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    res.locals.user = user;
    next();
  } catch (error) {
    next();
  }
}
