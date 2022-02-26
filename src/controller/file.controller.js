const { createAvatar, createFile } = require("../service/file.service");
const { updateAvatarUrlById } = require("../service/user.service");
const { APP_HOST, APP_PORT } = require("../app/config");

class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1.获取图像相关的信息以及用户信息
    // console.log(ctx.req.file);
    const { filename, mimetype, size } = ctx.req.file;
    const { id } = ctx.user;

    // 2.将图像信息数据保存在数据库中
    const result = await createAvatar(filename, mimetype, size, id);

    //3.将图片url保存在user表的avatar_url字段中
    const avatar_url = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await updateAvatarUrlById(avatar_url, id);

    //4.返回结果
    ctx.body = "上传头像成功";
  }

  async savePictureInfo(ctx, next) {
    // 1.获取信息
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;

    // 2.将所有文件信息保存到数据库中
    for (let file of files) {
      const { filename, mimetype, size } = file;
      await createFile(filename, mimetype, size, id, momentId);
    }

    ctx.body = `所有的动态配图上传成功`;
  }
}

module.exports = new FileController();
