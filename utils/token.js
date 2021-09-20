import jwt from "jsonwebtoken";

// const config = require('../config');

const createAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.ACCESS_EXPIRES,
  });
};

const createRefreshToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.REFRESH_EXPIRES,
  });
};

const createTokensPair = (id) => {
  return {
    access: createAccessToken(id),
    refresh: createRefreshToken(id),
  };
};

const verifyToken = (token) => {
  const payload = jwt.verify(token, process.env.SECRET_KEY);

  return payload;
};

export default {
  createAccessToken,
  createRefreshToken,
  createTokensPair,
  verifyToken,
};
