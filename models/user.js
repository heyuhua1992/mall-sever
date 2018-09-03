const mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  userId: {type: String},
  userName: {type: String},
  userPwd: {type: String},
  orderList: {type: Array},
  cartList: [
    {
      productId: {type: String},
      productName: {type: String},
      salePrice: {type: Number},
      productImage: {type: String},
      checked: {type: String},
      productNum: {type: Number}
    }
  ],
  addressList: {type: Array}
})

module.exports = mongoose.model('User', userSchema)