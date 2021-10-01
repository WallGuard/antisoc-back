import userController from "../controllers/users/users";

export default (router) => {
  router.post("/edit", userController.editUser);
  router.post("/set-avatar", userController.setAvatar);
  router.get("/get-user/:id", userController.getUser);
};
