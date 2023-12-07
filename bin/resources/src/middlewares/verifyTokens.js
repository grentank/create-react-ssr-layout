import jwt from 'jsonwebtoken';
import generateTokens from '../utils/generateTokens';
import cookiesConfig from '../config/cookiesConfig';
import 'dotenv/config';

export function verifyRefreshToken(req, res, next) {
  try {
    const currentRefreshToken = req.cookies.refreshToken;
    const { user } = jwt.verify(currentRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const { accessToken, refreshToken } = generateTokens({ user });
    res.locals.user = user;
    res
      .cookie('accessToken', accessToken, cookiesConfig.access)
      .cookie('refreshToken', refreshToken, cookiesConfig.refresh);

    next();
  } catch (error) {
    console.log('Failed verification of the refresh token');
    res.clearCookie('refreshToken').sendStatus(403);
  }
}

export function verifyAccessToken(req, res, next) {
  try {
    const { accessToken } = req.cookies;
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    console.log('Failed verification of the access token');
    verifyRefreshToken(req, res, next);
  }
}
