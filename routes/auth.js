const userController = require("../controllers/auth/signUp");

module.exports = (router) => {
  router.post("/sign-up", userController.signUp);
  router.post('/login', userController.login);
//   router.get('/auth', authMiddleware, userController.check)
};
