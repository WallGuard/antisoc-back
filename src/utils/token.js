import jwt from "jsonwebtoken";

const createAccessToken = (id) => {
  try {
    const payload = { id };
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.ACCESS_EXPIRES,
    });
  } catch (err) {
    console.log(err);
  }
};

const createRefreshToken = (id) => {
  try {
    const payload = { id };
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.REFRESH_EXPIRES,
    });
  } catch (err) {
    console.log(err);
  }
};

const createTokensPair = (id) => {
  console.log('TYTb for PAIR');
  try {
    return {
      access: createAccessToken(id),
      refresh: createRefreshToken(id),
    };
  } catch (err) {
    console.log(err);
  }
};

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    return payload;
  } catch (err) {
    console.log(err);
  }
};

export default {
  createAccessToken,
  createRefreshToken,
  createTokensPair,
  verifyToken,
};
