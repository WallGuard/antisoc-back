const userController = require("../controllers/auth/index");
const authControl = require("../controllers/auth");

export default function(router) {
  router.post("/sign-up", userController.signUp);
  router.post("/signup", authControl.signUp);
  // router.post('/login', userController.login);
//   router.get('/auth', authMiddleware, userController.check)
};
