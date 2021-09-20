const userController = require("../controllers/users/users");

module.exports = (router) => {
  router.get("/get-users", userController.getUsers);
};
