const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Goods = require('../models/goods')
const User = require('../models/user')

// var url = 'mongodb+srv://cluster-mall-wci8o.mongodb.net/mall'
let url = 'mongodb://127.0.0.1:27017/mall'
// 连接数据库 本地的db不需要{ useNewUrlParser: true }
mongoose.connect(url, {useNewUrlParser: true}, (err) => {
  if (err) {
    console.log('连接失败')
  } else {
    console.log('连接成功')
  }
})
// 断开连接
// setTimeout(() => {
//   mongoose.disconnect(() => {
//     console.log('已断开连接')
//   })
// }, 5000)
// 查询商品列表
router.get('/list', (req, res, next) => {
  let page = parseInt(req.param("page") || req.query.page) // 当前页码
  let pageSize = parseInt(req.param("pageSize") || req.query.pageSize) //每页显示多少条
  let priceLevel = req.param('priceLevel') || req.query.priceLevel || 'all'
  let sort = req.param("sort") || req.query.sort // 升序降序
  let skip = (page - 1 ) * pageSize //要跳过多少条
  let priceGt = -1, priceLte = -1
  let params ={} //搜索条件
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 500;break;
      case '1': priceGt = 500; priceLte = 1000;break;
      case '2': priceGt = 1000; priceLte = 2000;break;
      case '3': priceGt = 2000; priceLte = 9999;break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  // 通过find查找导数据，通过skip跳过多少条，通过limit显示的数目
  var goodsModel = Goods.find(params).sort({'salePrice':sort}).skip(skip).limit(pageSize)
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})
// 加入购物车
router.post("/addCart", (req, res, next) => {
  let userId = '100000077', 
      productId = req.body.productId

  User.findOne({userId: userId}, (userErr, userDoc) => {
    if (userErr) {
      res.json({
        status: 1,
        msg: userErr.message
      })
    } else {
      if(!userDoc) {return}

      let goodsItem = ''
      userDoc.cartList.forEach((item, index) => {
        if (item.productId === productId) {
          goodsItem = item
          item.productNum++
        }
      })
      if (goodsItem) {
        userDoc.save((err4, doc4) => {
          if (err4) {
            res.json({
              status: 1,
              msg: err4.message
            })
          } else {
            res.json({
              status: 0,
              msg: '数量更改成功',
              result: 'success'
            })
          }
        })
      } else {
        Goods.findOne({productId: productId}, (goodsErr, goodsDoc) => {
          if (goodsErr) {
            res.json({
              status: 1,
              msg: goodsErr.message
            })
          } else {
            if (!goodsDoc) {return}
            goodsDoc = goodsDoc.toObject()
            goodsDoc.productNum = 1
            goodsDoc.checked = 1
            userDoc.cartList.push(goodsDoc)
            userDoc.save((err3, doc3) => {
              if (err3) {
                res.json({
                  status: 1,
                  msg: err3.message
                })
              } else {
                res.json({
                  status: 0,
                  msg: '加入购物车成功',
                  result: 'success'
                })
              }
            })
          }
        })
      }
    }
  })
})
module.exports = router
