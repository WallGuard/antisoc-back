const userController = require("../controllers/users");

module.exports = (router) => {
  router.get("/get-users", userController.getUsers);
};
