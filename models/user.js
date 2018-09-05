const mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  userId: {type: String},
  userName: {type: String},
  userPwd: {type: String},
  orderList: [
    {
      orderId: {type: String},
      orderTotal: {type: Number},
      addressInfo: {
        addressId: {type: String},
        userName: {type: String},
        streetName: {type: String},
        postCode: {type: Number},
        tel: {type: Number},
        isDefault: {type: Boolean}
      },
      goodsList: [
        {
          productId: {type: String},
          productName: {type: String},
          salePrice: {type: Number},
          productImage: {type: String},
          checked: {type: Boolean},
          productNum: {type: Number}
        }
      ],
      orderStatus: {type: Number},
      createDate: {type: String}
    }
  ],
  cartList: [
    {
      productId: {type: String},
      productName: {type: String},
      salePrice: {type: Number},
      productImage: {type: String},
      checked: {type: Boolean},
      productNum: {type: Number}
    }
  ],
  addressList: [
    {
      addressId: {type: String},
      userName: {type: String},
      streetName: {type: String},
      postCode: {type: Number},
      tel: {type: Number},
      isDefault: {type: Boolean}
    }
  ]
})

module.exports = mongoose.model('User', userSchema)