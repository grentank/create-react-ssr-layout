import jwtConfig from './jwtConfig';

const cookiesConfig = {
  refresh: {
    httpOnly: true,
    maxAge: jwtConfig.refresh.expiresIn,
  },
  access: {
    httpOnly: true,
    maxAge: jwtConfig.access.expiresIn,
  },
};

export default cookiesConfig;
