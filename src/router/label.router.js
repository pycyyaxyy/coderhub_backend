const Router = require("koa-router");
const { verifyAuth } = require("../middleware/auth.middleware");
const { create, list } = require("../controller/label.controller");
const { verifyLabelhasExist } = require("../middleware/label.middleware");

const labelRouter = new Router({
  prefix: "/label",
});

//创建标签
labelRouter.post("/", verifyAuth, verifyLabelhasExist, create);
//获取标签列表
labelRouter.get("/", list);

module.exports = labelRouter;
