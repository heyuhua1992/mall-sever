const mongoose = require('mongoose')
module.exports = () => {
  // 用户名与密码存储在admin 所以配置要加上authSource=admin
  let url = 'mongodb+srv://root:heyuhua@cluster-mall-wci8o.mongodb.net/mall?authSource=admin'
  // let url = 'mongodb://127.0.0.1:27017/mall'
  // 连接数据库 本地的db不需要{ useNewUrlParser: true }
  return mongoose.connect(url, {useNewUrlParser: true}, (err) => {
    if (err) {
      console.log('连接失败')
    } else {
      console.log('连接成功')
    }
  })
}
