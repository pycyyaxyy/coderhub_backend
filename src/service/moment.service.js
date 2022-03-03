const connection = require("../app/database");

class MomentService {
  async create(userId, content) {
    //将内容插入到数据库moment表中
    const statement = `INSERT INTO moment (user_id,content) VALUES (?,?);`;
    const result = await connection.execute(statement, [userId, content]);
    return result[0];
  }

  // async getMomentById(momentId) {
  //   //查询moment表中的单条数据
  //   const statement = `SELECT m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
  //   JSON_OBJECT('id',u.id,'name',u.name) user
  //   FROM moment m LEFT JOIN user u ON m.user_id=u.id
  //   WHERE m.id=?;`;
  //   const [result] = await connection.execute(statement, [momentId]);
  //   return result[0];
  // }

  async getMomentById(id) {
    const statement = `
      SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
        IF(COUNT(l.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', l.id, 'name', l.name)
        ),NULL) labels,
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                      'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', cu.avatar_url))
        ),NULL) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename))
        FROM file WHERE m.id = file.moment_id) images
      FROM moment m
      LEFT JOIN user u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON m.id = ml.moment_id
      LEFT JOIN label l ON ml.label_id = l.id
      WHERE m.id = ?
      GROUP BY m.id;
    `;
    try {
      const [result] = await connection.execute(statement, [id]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  async getMomentList(offset, size) {
    //查询moment列表
    const statement = `
    SELECT 
         m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
         JSON_OBJECT('id', u.id, 'name', u.name ,'avatarUrl', u.avatar_url) author,
         (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
         (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
         (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
         FROM file WHERE m.id = file.moment_id) images
         FROM moment m
     LEFT JOIN user u ON m.user_id = u.id
         LIMIT ?, ?;`;

    const [result] = await connection.execute(statement, [offset, size]);
    return result;
  }

  async update(momentId, content) {
    const statement = `UPDATE moment set content=? WHERE id=?;`;
    const [result] = await connection.execute(statement, [content, momentId]);
    return result;
  }

  async remove(momentId) {
    const statement = `DELETE FROM moment WHERE id=?`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }

  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label where moment_id=? and label_id=?`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result.length === 0 ? false : true;
  }

  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id,label_id) values(?,?)`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }

  async getMomentByUserId(userId) {
    //通过用户id来找相关动态
    const statement = `
      SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
        IF(COUNT(l.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', l.id, 'name', l.name)
        ),NULL) labels,
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                      'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', cu.avatar_url))
        ),NULL) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename))
        FROM file WHERE m.id = file.moment_id) images
      FROM moment m
      LEFT JOIN user u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON m.id = ml.moment_id
      LEFT JOIN label l ON ml.label_id = l.id
      WHERE m.user_id = ?
      GROUP BY m.id;
    `;
    const result = await connection.execute(statement, [userId]);
    // console.log(result); //其实是个二维数组 数组的第一个元素是保存结果的（也是数组），第二个元素是保存字段的数组
    return result[0];
  }
}

module.exports = new MomentService();
