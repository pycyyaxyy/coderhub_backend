const Router = require("koa-router");
const { login, success } = require("../controller/auth.controller");
const { verifyLogin, verifyAuth } = require("../middleware/auth.middleware");

const authRouter = new Router();

//登录接口
authRouter.post("/login", verifyLogin, login);

//测试接口
authRouter.post("/test", verifyAuth, success);

module.exports = authRouter;
