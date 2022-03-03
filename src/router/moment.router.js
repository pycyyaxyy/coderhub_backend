const Router = require("koa-router");

const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth.middleware");
const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo,
  getUserMoment,
} = require("../controller/moment.controller");

const { verifyLabelsExists } = require("../middleware/label.middleware");

const momentRouter = new Router({
  prefix: "/moment",
});

//发布动态接口
momentRouter.post("/", verifyAuth, create);

//查询动态接口（单条）
momentRouter.get("/:momentId", detail);

//查询动态接口（列表）
momentRouter.get("/", list);

//修改动态接口
momentRouter.patch("/:momentId", verifyAuth, verifyPermission, update);

//删除动态接口
momentRouter.delete("/:momentId", verifyAuth, verifyPermission, remove);

//给动态添加标签
momentRouter.post(
  "/:momentId/labels",
  verifyAuth,
  verifyPermission,
  verifyLabelsExists,
  addLabels
);

//动态配图的服务
momentRouter.get("/images/:filename", fileInfo);

//根据用户id查找动态
momentRouter.get("/userId/:userId", getUserMoment);

module.exports = momentRouter;
