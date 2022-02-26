const Router = require("koa-router");

const { verifyAuth } = require("../middleware/auth.middleware");
const {
  avatarHandler,
  pictureHandler,
  pictureResize,
} = require("../middleware/file.middleware");
const {
  saveAvatarInfo,
  savePictureInfo,
} = require("../controller/file.controller");

const fileRouter = new Router({
  prefix: "/upload",
});

//上传头像接口
fileRouter.post("/avatar", verifyAuth, avatarHandler, saveAvatarInfo);

//上传动态配图接口
fileRouter.post(
  "/picture",
  verifyAuth,
  pictureHandler,
  pictureResize,
  savePictureInfo
);

module.exports = fileRouter;
