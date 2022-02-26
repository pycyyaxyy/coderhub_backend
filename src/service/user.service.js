const connection = require("../app/database");

class UserService {
  async create(user) {
    //将user存储到数据库中
    const { name, password } = user;
    const statement = `INSERT INTO user (name,password) VALUES(?,?)`;
    const result = await connection.execute(statement, [name, password]);
    return result[0];
  }

  async getUserByName(name) {
    //通过姓名查找记录
    const statement = `SELECT * FROM user WHERE name=?;`;
    const result = await connection.execute(statement, [name]);
    // console.log(result); //其实是个二维数组 数组的第一个元素是保存结果的（也是数组），第二个元素是保存字段的数组
    return result[0];
  }

  async updateAvatarUrlById(avatarUrl, id) {
    const statement = `UPDATE user SET avatar_url=? WHERE id=?`;
    const [result] = await connection.execute(statement, [avatarUrl, id]);
    return result;
  }
}

module.exports = new UserService();
