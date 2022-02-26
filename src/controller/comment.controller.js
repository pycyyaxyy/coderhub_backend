const {
  create,
  reply,
  update,
  remove,
  getCommentsBymomentId,
} = require("../service/comment.service");

class CommentController {
  async create(ctx, next) {
    // 1.拿到参数
    const { momentId, content } = ctx.request.body;
    const { id } = ctx.user;

    //2.添加评论
    const result = await create(momentId, content, id);
    ctx.body = result;
  }

  async reply(ctx, next) {
    // 1.拿到参数
    const { momentId, content } = ctx.request.body;
    const { commentId } = ctx.params;
    const { id } = ctx.user;

    //2.回复评论
    const result = await reply(momentId, content, id, commentId);
    ctx.body = result;
  }

  async update(ctx, next) {
    const { commentId } = ctx.params;
    const { content } = ctx.request.body;

    const result = await update(commentId, content);
    ctx.body = result;
  }

  async remove(ctx, next) {
    const { commentId } = ctx.params;

    const result = await remove(commentId);
    ctx.body = result;
  }

  async list(ctx, next) {
    // 1.获取数据
    const { momentId } = ctx.query;

    const result = await getCommentsBymomentId(momentId);
    ctx.body = result;
  }
  
}

module.exports = new CommentController();
