const { StatusCodes } = require('http-status-codes');

const userService = require('../../db/services/user');
const { createTokensPair } = require('../../utils/token');

const { createError, createValidationErrorBody } = require('../../utils/createError');

const signIn = async (req, res, next) => {
  try {
    const {
      username,
      password,
    } = req.body;

    const user = await userService.signIn({
      username,
      password,
    });

    if (user.status === 'disabled') {
      throw createError(
        createValidationErrorBody([
          { path: 'username', message: 'Пользователь отключён' },
        ]),
        { code: StatusCodes.FORBIDDEN },
      );
    }

    res.json({
      ...createTokensPair(user.id),
      user,
    });
  } catch (err) {
    if (err.type === 'custom') {
      return res.status(err.code).json(err.message);
    }

    err.functionName = signIn.name;
    err.fileName = __filename;
    next(err);
  };
};

module.exports = signIn;
