const userController = require("../controllers/users/users");

module.exports = (router) => {
  router.post("/edit", userController.editUser);
  router.post("/set-avatar", userController.setAvatar);
  router.get("/get-user/:id", userController.getUser);
};
