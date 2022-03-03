const fs = require("fs");

const service = require("../service/user.service");
const { getAvatarByUserId } = require("../service/file.service");
const { AVATAR_PATH } = require("../constants/file-path");

class UserController {
  async create(ctx, next) {
    //获取用户请求传递的参数
    const user = ctx.request.body;
    //查询数据
    const result = await service.create(user);
    //返回数据
    ctx.body = result;
  }

  async avatarInfo(ctx, next) {
    // 1.从数据库中获取图像信息
    const { userId } = ctx.params;

    //这里设置如果用户上传了多个头像，始终以最新上传的为准，即从数据库中查询到的最后一条记录作为头像数据
    const avatarInfoArr = await getAvatarByUserId(userId);
    const avatarInfo = avatarInfoArr[avatarInfoArr.length - 1];
    // console.log(avatarInfo);

    // 2.在浏览器上显示图像
    ctx.response.set("content-type", avatarInfo.mimetype); //如果不设置这个头像会被直接下载下来
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
  }

  async getUserInfo(ctx, next) {
    const { userId } = ctx.params;

    const [userInfo] = await service.getUserById(userId);

    ctx.body = userInfo;
  }
}

module.exports = new UserController();
