const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const path = require("path");
const { User } = require("../db/models/models");

const generateJwt = (id, email, role) => {
  return jwt.sign(
    {
      id,
      email,
      role,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

class UserController {
  async signUp(req, res, next) {
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
    const token = generateJwt(user.id, user.email);
    return res.json({
      token,
    });
  }

  async editUser(req, res, next) {
    const candidate = await User.findOne({
      where: {
        id: req.body.id,
      },
    });
    if (req.body.firstName) {
      candidate.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      candidate.lastName = req.body.lastName;
    }
    if (req.body.gender === "male" || req.body.gender === "female") {
      candidate.gender = req.body.gender;
    }
    if (req.body.status) {
      candidate.status = req.body.status;
    }

    await User.update(
      {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        gender: candidate.gender,
        status: candidate.status,
      },
      {
        where: {
          id: candidate.id,
        },
      }
    );
    return res.json({
      candidate,
    });
  };

  // async login(req, res, next) {
  //   const {
  //     email,
  //     password
  //   } = req.body
  //   const user = await User.findOne({
  //     where: {
  //       email
  //     }
  //   })
  //   if (!user) {
  //     return next(ApiError.internal('Пользователь не найден'))
  //   }
  //   let comparePassword = bcrypt.compareSync(password, user.password)
  //   if (!comparePassword) {
    // +++
  //     return next(ApiError.internal('Указан неверный пароль'))
  //   }
  //   const token = generateJwt(user.id, user.email, user.role)
  //   return res.json({
  //     token
  //   })
  // };

  // async check(req, res, next) {
  //   const token = generateJwt(req.user.id, req.user.email, req.user.role)
  //   return res.json({
  //     token
  //   })
  // };

  async getUsers(req, res, next) {
    console.log('Tytb');
    try {
      const { page = 1, count = 5 } = req.query;
      const limit = count;
      let offset = page * count - count;

      const users = await User.findAndCountAll({
        limit,
        offset,
        // where: {}, // conditions
      });
      // const users = await User.findAll()
      // console.log(users);
      return res.json(users.rows);
    } catch (error) {
      console.log(error);
    }
  };

  async getUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        where: { id: id },
      });
      const userData = {
        id: 2,
        email: "wallguard313@gmail1.com",
        role: "USER",
        firstName: "Alik",
        lastName: null,
        gender: "male",
        status: null,
        img: "48c3b5b3-931f-4bd9-bd52-d99ce2c11ca0.jpg"
      };
      console.log(user);
      return res.json(user);
    } catch (error) {
      console.log(error);
    }
  };

  async setAvatar(req, res, next) {
    try {
      const { id } = req.body;
      const { img } = req.files;

      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const avatar = await User.update(
        {
          img: fileName,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.json(avatar);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
};

module.exports = new UserController();
