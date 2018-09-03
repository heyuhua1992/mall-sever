const mongoose = require('mongoose')
let Schema = mongoose.Schema

let productSchema = new Schema({
  productId:{type: String, required: true},
  productName:{type: String},
  salePrice:{type: Number},
  productImage:{type: String}
})

module.exports = mongoose.model('Good', productSchema)