const Router = require('express');
const router = new Router();
const userRouter = require('./users');

router.use('/users', userRouter);

module.exports = router
