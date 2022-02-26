const Router = require("koa-router");
const { create, avatarInfo } = require("../controller/user.controller");
const { verifyUser, handlePassword } = require("../middleware/user.middleware");

const userRouter = new Router({
  prefix: "/users",
});

//创建用户接口
userRouter.post("/", verifyUser, handlePassword, create);

//获取用户头像接口
userRouter.get("/:userId/avatar", avatarInfo);

module.exports = userRouter;
