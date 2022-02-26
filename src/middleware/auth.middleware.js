const jwt = require("jsonwebtoken");

const errorTypes = require("../constants/error-types");
const userService = require("../service/user.service");
const AuthService = require("../service/auth.service");
const md5password = require("../utils/password-handle");
const { PUBLIC_KEY } = require("../app/config");

const verifyLogin = async (ctx, next) => {
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body;

  //2.判断用户名或密码不能为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", error, ctx);
  }

  //3.判断用户是否存在(用户不存在的时候result为一个空的数组)
  const result = await userService.getUserByName(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
    return ctx.app.emit("error", error, ctx);
  }

  //4.判断请求中的用户密码是否和数据库中的是否一致（加密）
  if (md5password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
    return ctx.app.emit("error", error, ctx);
  }

  //这里之前拿到了user，传递给ctx的user属性，用于后续的颁发token
  ctx.user = user;

  await next();
};

const verifyAuth = async (ctx, next) => {
  console.log("验证授权登录");

  // 1.获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit("error", error, ctx);
  }

  const token = authorization.replace("Bearer ", "");

  //2.验证token result里面有id、name、iat、exp
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = result; //会在这里把用户信息放在ctx.user里面
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit("error", error, ctx);
  }
};

// 方法一:在验证的时候采用闭包 每次验证权限需要传入表的名称
// const verifyPermission = (tableName) => {
//   return async (ctx, next) => {
//     console.log("验证权限的middleware");

//     // 1.获取参数
//     const { momentId } = ctx.params;
//     const { id } = ctx.user;

//     //2.查询是否具备权限
//     try {
//       const isPermission = await AuthService.checkResource(
//         tableName,
//         momentId,
//         id
//       );
//       if (!isPermission) throw new Error();
//       await next();
//     } catch (err) {
//       const error = new Error(errorTypes.UNPERMISSION);
//       return ctx.app.emit("error", error, ctx);
//     }
//   };
// };

//方法二：如果全部使用restful风格可以用以下方式拿到tableName的值，从而在每次调用的时候不需要传入表的名字
const verifyPermission = async (ctx, next) => {
  console.log("验证权限的middleware");

  // 1.获取参数
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace("Id", "");
  const resourceId = ctx.params[resourceKey];
  const { id } = ctx.user;

  // console.log("tableName:", tableName);
  // console.log("userId:", id);
  // console.log("momentId:", resourceId);

  //2.查询是否具备权限
  try {
    const isPermission = await AuthService.checkResource(
      tableName,
      resourceId,
      id
    );
    // console.log(isPermission);
    if (!isPermission) throw new Error();
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit("error", error, ctx);
  }
};

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission,
};
