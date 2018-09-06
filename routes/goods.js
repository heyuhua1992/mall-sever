const express = require('express');
const router = express.Router();
const Goods = require('../models/goods')
const User = require('../models/user')

// 查询商品列表
router.get('/list', (req, res, next) => {
  let page = parseInt(req.query.page) // 当前页码
  let pageSize = parseInt(req.query.pageSize) //每页显示多少条
  let priceLevel = req.query.priceLevel || 'all'
  let sort = req.query.sort // 升序降序
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
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '操作成功',
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
  let userId = req.cookies.userId, 
      productId = req.body.productId

  User.findOne({userId: userId}, (userErr, userDoc) => {
    if (userErr) {
      res.json({
        status: 1,
        msg: userErr.message,
        result: ''
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
              msg: err4.message,
              result: ''
            })
          } else {
            res.json({
              status: 0,
              msg: '操作成功',
              result: ''
            })
          }
        })
      } else {
        Goods.findOne({productId: productId}, (goodsErr, goodsDoc) => {
          if (goodsErr) {
            res.json({
              status: 1,
              msg: goodsErr.message,
              result: ''
            })
          } else {
            if (!goodsDoc) {return}
            // goodsDoc = goodsDoc.toObject() // 如果数据库中没有goodsDoc.checked 则需要把doc转为obj，否则无法设置
            goodsDoc.productNum = 1
            goodsDoc.checked = true
            userDoc.cartList.push(goodsDoc)
            userDoc.save((err3, doc3) => {
              if (err3) {
                res.json({
                  status: 1,
                  msg: err3.message,
                  result: ''
                })
              } else {
                res.json({
                  status: 0,
                  msg: '已加入购物车',
                  result: ''
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
