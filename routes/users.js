const Router = require('express');
const router = new Router();
const userController = require('../controllers/users');
// const authMiddleware = require('../middleware/authMiddleware')

router.post('/sign-up', userController.signUp);
router.post('/edit', userController.editUser);
router.post('/set-avatar', userController.setAvatar);
// router.post('/login', userController.login)
// router.get('/auth', authMiddleware, userController.check)
router.get('/get-users', userController.getUser);

module.exports = router;
