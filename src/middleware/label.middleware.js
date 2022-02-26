const { create, getLabelByName } = require("../service/label.service");
const errorTypes = require("../constants/error-types");

const verifyLabelsExists = async (ctx, next) => {
  // 1.取出要添加的所有标签
  const { labels } = ctx.request.body;

  // 2.判断每一个标签在label表中是否存在
  const newLabels = [];
  for (let name of labels) {
    const labelResult = await getLabelByName(name);
    const label = { name };
    if (!labelResult) {
      // 创建标签数据
      const result = await create(name);
      label.id = result.insertId;
    } else {
      label.id = labelResult.id;
    }
    newLabels.push(label);
  }

  ctx.labels = newLabels;
  await next();
};

//判断label表中是否已经存在标签
const verifyLabelhasExist = async (ctx, next) => {
  // 1.拿到想要创建的标签
  const { name } = ctx.request.body;

  // 2.检查标签是否存在
  const labelResult = await getLabelByName(name);
  if (labelResult) {
    //如果标签已经存在
    const error = new Error(errorTypes.LABEL_CAN_NOT_BE_REPEAT);
    return ctx.app.emit("error", error, ctx);
  }

  await next();
};

module.exports = {
  verifyLabelsExists,
  verifyLabelhasExist,
};
