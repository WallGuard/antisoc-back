const ApiError = require("../../error/ApiError");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
// const uuid = require("uuid");
// const path = require("path");
const { User } = require("../../db/models/models");
const userService = require('../../db/services/user')

const { createTokensPair } = require('../../utils/token');

class authController {
  async signUp(req, res, next) {
    try {
      console.log('TYTb');
      const { email, password } = req.body;
      if (!email || !password) {
        return next(ApiError.badRequest("Некорректный email или password"));
      }
      const candidate = await User.findOne({
        where: {
          email,
        },
      });
      if (candidate) {
        return next(ApiError.badRequest("This email is already in use!"));
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({
        email,
        password: hashPassword,
      });
      console.log('TYTb 2');
      console.log(createTokensPair(user.id));
      return res.status(StatusCodes.CREATED).json({
        ...createTokensPair(user.id),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          status: user.status,
          img: user.img,
        },
      });
    } catch (err) {
      if (err.type === "custom") {
        return res.status(err.code).json(err.message);
      }
    };
  };

  async login(req, res, next) {
    console.log('TYTb');
    try {
      const {
        username,
        password,
      } = req.body;
  
      const user = await userService.signIn({
        username,
        password,
      });
  
      // if (user.status === 'disabled') {
      //   throw createError(
      //     createValidationErrorBody([
      //       { path: 'username', message: 'Пользователь отключён' },
      //     ]),
      //     { code: StatusCodes.FORBIDDEN },
      //   );
      // }
  
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
    }
  };
};

module.exports = new authController();
