const jwt = require('jsonwebtoken');

// const config = require('../config');

const createAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: process.env.ACCESS_EXPIRES },
  );
};

const createRefreshToken = (id) => {
  const payload = { id };
  return jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: process.env.REFRESH_EXPIRES },
  );
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

module.exports = {
  createAccessToken,
  createRefreshToken,
  createTokensPair,
  verifyToken,
};
