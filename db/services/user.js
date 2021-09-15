const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');

const db = require('../models');
const SearchBuilder = require('../../utils/SearchBuilder');
const hash = require('../../utils/hash');
const {
  createError,
  createValidationErrorBody,
} = require('../../utils/createError');

const fieldsForExclude = [
  'password',
  'resetPasswordToken',
  'resetPasswordExpires',
];
const excludeFields = (user) => {
  const filtered = user.toJSON();

  fieldsForExclude.forEach((fieldName) => {
    delete filtered[fieldName];
  });

  return filtered;
};

/**
 * @param {{
    email: string;
    login: string;
    phone: string;
    password: string;
 * }} data
 */
const signUp = async ({ email, login, phone, password }) => {
  const userWithSameEmail = await db.user.findOne({ where: { email } });
  if (userWithSameEmail) {
    throw createError(
      createValidationErrorBody([{ path: 'email', message: 'Email занят' }]),
    );
  }

  const userWithSameLogin = await db.user.findOne({ where: { login } });
  if (userWithSameLogin) {
    throw createError(
      createValidationErrorBody([{ path: 'login', message: 'Логин занят' }]),
    );
  }

  const newUser = await db.user.create({
    email,
    login,
    phone,
    password,
  });

  return excludeFields(newUser);
};

/**
 * @param {{
    username: string;
    password: string;
 * }} data
 */
const signIn = async ({ username = '', password = '' }) => {
  const user = await db.user.findOne({
    where: {
      [Op.or]: [{ login: username }, { email: username }],
    },
    attributes: {
      include: ['password'],
    },
  });

  if (!user) {
    throw createError(
      createValidationErrorBody([
        { path: 'username', message: 'Пользователь не найден' },
      ]),
      { code: StatusCodes.NOT_FOUND },
    );
  }

  if (user.password !== hash(password)) {
    throw createError(
      createValidationErrorBody([
        { path: 'password', message: 'Не верный пароль' },
      ]),
    );
  }

  return excludeFields(user);
};

const getOne = async (id) => {
  const user = await db.user.findByPk(id);

  return user;
};

/**
 * @param {{
    pagination: {
      perPage: string;
      page: string;
    };
    sort: {
      sortBy: string;
      sortDirection: "straight" | "reverse";
    };
    filter: {
      role: array;
      tech_role: array;
      status: array;
      isDev: boolean;
      search: string;
    };
 * }} params
 */
const getList = async (params) => {
  const formattedFilter = {};

  Object.keys(params.filter || {}).forEach((key) => {
    const value = params.filter[key];

    if (['role', 'tech_role', 'status'].includes(key)) {
      formattedFilter[key] = {
        type: '$or',
        value,
      };
    } else if (key === 'search') {
      formattedFilter.search = {
        type: '$search',
        value,
        fields: [
          'email',
          'login',
          'firstName',
          'firstName_ru',
          'lastName',
          'lastName_ru',
          'slack_name',
        ],
      };
    } else {
      formattedFilter[key] = value;
    }
  });

  const query = new SearchBuilder({
    pagination: params.pagination,
    sort: params.sort,
    filter: formattedFilter,
  }).buildQuery();
  const users = await db.user.findAll(query);

  return users;
};

const updateUserFromAdmin = async (id, data) => {
  const [updatedItemsCount, [user]] = await db.user.update(data, {
    where: { id },
    returning: true,
  });

  if (!updatedItemsCount) {
    throw createError(
      createValidationErrorBody([
        { path: 'id', message: 'Пользователь не найден' },
      ]),
      { code: StatusCodes.NOT_FOUND },
    );
  }

  return user;
};

/**
 * @param {number} id
 * @param {{
 * login: string;
 * phone: string;
 * email: string;
 * slack_name: string;
 * firstName: string;
 * firstName_ru: string;
 * lastName: string;
 * lastName_ru: string;
 * education: string;
 * education_ru: string;
 * info: string;
 * repo: array;
 * DoB: date;
 * }} data
 */
const update = async (id, data) => {
  const [updatedItemsCount, [user]] = await db.user.update(data, {
    where: { id },
    returning: true,
  });

  if (!updatedItemsCount) {
    throw createError(
      createValidationErrorBody([
        { path: 'id', message: 'Пользователь не найден' },
      ]),
      { code: StatusCodes.NOT_FOUND },
    );
  }

  return user;
};

/**
 *
 * @param {number} id
 * @param {{
 * oldPassword: string;
 * password: string;
 * }} data
 */
const changePassword = async (id, data) => {
  const user = await db.user.findOne({
    where: { id },
    attributes: { include: ['password'] },
  });

  if (user.password !== hash(data.oldPassword)) {
    throw createError(
      createValidationErrorBody([
        { path: 'oldPassword', message: 'Не верный пароль' },
      ]),
    );
  }

  await user.update({ password: data.password });
};

module.exports = {
  excludeFields,
  signUp,
  signIn,
  getOne,
  getList,
  update,
  changePassword,
  updateUserFromAdmin,
};
