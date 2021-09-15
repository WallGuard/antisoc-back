/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const changeCase = require("change-case");
const express = require("express");
const requireDirectory = require("require-directory");

const routes = requireDirectory(module, "./");

module.exports = (app) => {
  Object.keys(routes).forEach((routeName) => {
    const router = express.Router();

    require(`./${routeName}`)(router);

    app.use(`/api/${changeCase.paramCase(routeName)}`, router);
  });
};
