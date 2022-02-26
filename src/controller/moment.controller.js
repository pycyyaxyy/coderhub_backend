const fs = require("fs");

const fileService = require("../service/file.service");
const { PICTURE_PATH } = require("../constants/file-path");

const {
  create,
  getMomentById,
  getMomentList,
  update,
  remove,
  hasLabel,
  addLabel,
} = require("../service/moment.service");

class MomentController {
  async create(ctx, next) {
    // 1.拿到user_id
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    //2.将数据插入到数据库中
    const result = await create(userId, content);
    ctx.body = result;
  }

  async detail(ctx, next) {
    // 1.获取数据（momentId）
    const momentId = ctx.params.momentId;

    //2.根据id去查这条数据
    const result = await getMomentById(momentId);
    ctx.body = result;
  }

  async list(ctx, next) {
    //1.获取数据(offset,size)
    const { offset, size } = ctx.query;

    //2.查询列表
    const result = await getMomentList(offset, size);
    ctx.body = result;
  }

  async update(ctx, next) {
    // 1.获取参数
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;

    // 2.修改内容
    const result = await update(momentId, content);
    ctx.body = result;
  }

  async remove(ctx, next) {
    //1.获取参数
    const { momentId } = ctx.params;

    //2.删除记录
    const result = await remove(momentId);
    ctx.body = result;
  }

  async addLabels(ctx, next) {
    // 1.获取标签和动态id
    const { labels } = ctx;
    const { momentId } = ctx.params;

    // 2.添加所有的标签
    for (let label of labels) {
      // 2.1判断标签是否和动态有关系
      const isExist = await hasLabel(momentId, label.id);

      if (!isExist) {
        await addLabel(momentId, label.id);
      }
    }
    ctx.body = "给动态添加标签成功！";
  }

  async fileInfo(ctx, next) {
    let { filename } = ctx.params;
    const fileInfo = await fileService.getFileByFilename(filename);
    const { type } = ctx.query;
    const types = ["small", "middle", "large"];
    //查看调用接口时有没有加size的query，如果没有就是默认大小
    if (types.some((item) => item === type)) {
      filename = filename + "-" + type;
    }
    ctx.response.set("content-type", fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }
}

module.exports = new MomentController();
