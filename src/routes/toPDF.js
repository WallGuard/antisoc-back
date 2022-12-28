import userController from "../controllers/users/users";

export default (router) => {
  router.get("/generate-pdf", userController.getUsers);
};
