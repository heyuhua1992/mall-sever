const express = require('express');
const router = express.Router();
const User = require('../models/user')
require('../util/date')
/**
 *登陆接口
 */
router.post('/login', (req, res, next) => {
  let params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(params).select({userId: 1, userPwd: 1, userName: 1}).exec((err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: '用户名或密码错误'
      })
    } else {
      if (!doc) {return}
      res.cookie('userId', doc.userId, {
        path: '/',
        maxAge: 1000 * 60 * 60
      })
      res.cookie('userName', doc.userName, {
        path: '/',
        maxAge: 1000 * 60 * 60
      })
      // req.session.user = doc
      res.json({
        status: 0,
        msg: '登陆成功',
        result: {
          userName: doc.userName,
          userId: doc.userId
        }
      })
    }
  })
})
// 登出接口
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: "/",
    maxAge: -1
  })
  res.cookie('userName', '', {
    path: "/",
    maxAge: -1
  })
  res.json({
    status: 0,
    msg: '您已经退出登录',
    result: ''
  })
})
// 检查是否登陆
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: 0,
      msg: '用户已登陆',
      result: {
        userName: req.cookies.userName,
        userId: req.cookies.userId
      }
    })
  } else {
    res.json({
      status: 1,
      msg: '用户未登录',
      result: ''
    })
  }
})
// 查询当前用户购物车数据
router.get('/cartList', (req, res, next) => {
  let userId = req.cookies.userId
  User.findOne({userId: userId})
    .exec((err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message,
          result: ''
        })
      } else {
        if (!doc) { 
          res.json({
            status: 1,
            msg: '购物车没有商品',
            result: ''
          })
        } else {
          res.json({
            status: 0,
            msg: '查询购物车数据成功',
            result: doc.cartList
          })
        }
      }
    })
})
// 购物车删除商品
router.post('/cartDel', (req, res, next) => {
  let userId = req.cookies.userId,
      productId = req.body.productId
  User.update({userId: userId}, {$pull: {cartList: {productId: productId}}})
    .exec((err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message,
          result: ''
        })
      } else {
        if (!doc) { return }
        res.json({
          status: 0,
          msg: '该商品已删除',
          result: ''
        })
      }
    })
})
// 商品数量修改
router.post('/cartEdit', (req, res, next) => {
  let userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  User.update({userId: userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }).exec((err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      if (!doc) { return }
      res.json({
        status: 0,
        msg: '修改成功',
        result: ''
      })
    }
  }) 
})
// 全选
router.post('/editCheckAll', (req, res, next) => {
  let userId = req.cookies.userId,
      checkAll = req.body.checkAll;
  User.findOne({userId: userId})
    .exec((err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message,
          result: ''
        })
      } else {
        if (!doc) { return }
        doc.cartList.forEach(item => {
          item.checked = checkAll
        })
        doc.save((err1, doc1) => {
          if (err1) {
            res.json({
              status: 1,
              msg: err1.message,
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
      }
    })
})
// 查询用户地址接口
router.post('/addressList', (req, res, next) => {
  let userId = req.cookies.userId
  User.findOne({userId: userId})
    .exec((err, doc) => {
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
          result: doc.addressList
        })
      }
    })
})
// 设置默认地址
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId,
      addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: 1003,
      msg: '缺少地址ID',
      result: ''
    })
  } else {
    User.findOne({userId: userId})
      .exec((err, doc) => {
        if (err) {
          res.json({
            status: 1,
            msg: err.message,
            result: ''
          })
        } else {
          let addressList = doc.addressList
          addressList.forEach(item => {
            if (item.addressId === addressId) {
              item.isDefault = true
            } else {
              item.isDefault = false
            }
          })
          doc.save((err1, doc1) => {
            if (err1) {
              res.json({
                status: 1,
                msg: err1.message,
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
        }
      })
  }
})
// 删除地址
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  User.update({userId: userId}, {$pull: {'addressList': {addressId: addressId}}})
    .exec((err, doc) => {
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
          result: ''
        })
      }
    })
})
// 付款，生成订单
router.post('/payMent', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  let orderTotal = 0
  // 获取用户购物车列表
  User.findOne({userId: userId})
    .exec((_err, _doc) => {
      if (_err) {
        res.json({
          status: 1,
          msg: err.message,
          result: ''
        })
      } else {
        if (!_doc) {
          res.json({
            status: 1,
            msg: '购物车没有商品',
            result: ''
          })
        } else {
          // 计算购物车选择商品总价格
          let subTotal = 0
          let freight = 10
          let discount = 200
          _doc.cartList.forEach(item => {
            if (item.checked === true) {
              subTotal += item.salePrice * item.productNum
            }
          })
          orderTotal = subTotal + freight - discount
          User.findOne({userId: userId})
            .exec((err, doc) => {
              if (err) {
                res.json({
                  status: 1,
                  msg: err.message,
                  result: ''
                })
              } else {
                let address = {}
                let goodsList = []
                let newCartList = []
                // 获取当前订单的地址
                doc.addressList.forEach(item => {
                  if (item.addressId === addressId) {
                    address = item
                  }
                })
                // 获取用户购物车商品,删除购物车已购买的商品
                newCartList = doc.cartList.filter(item => {
                  if (item.checked) {
                    goodsList.push(item)
                    return false
                  }
                  return item
                })
                let prefix = 622
                let r1 = Math.floor(Math.random() * 10)
                let r2 = Math.floor(Math.random() * 10)
                let sysDate = new Date().Format('yyyyMMddhhmmss')
                let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
                let orderId = prefix + r1 + sysDate + r2 + ''
                let order = {
                  orderId: orderId,
                  orderTotal: orderTotal,
                  addressInfo: address,
                  goodsList: goodsList,
                  orderStatus: 1, // 为1时未付款
                  createDate: createDate
                }
                doc.orderList.push(order)
                // 替换购物车列表
                doc.cartList = newCartList
                doc.save((err1, doc1) => {
                  if (err1) {
                    res.json({
                      status: 1,
                      msg: err1.message,
                      result: ''
                    })
                  } else {
                    res.json({
                      status: 0,
                      msg: '操作成功',
                      result: {
                        orderId: order.orderId,
                        orderTotal: order.orderTotal
                      }
                    })
                  }
                })
              }
            })
        }
      }
    })
})
// 根据订单ID查询订单信息
router.get('/orderDetail', (req, res, next) =>{
  let userId = req.cookies.userId
  let orderId = req.query.orderId
  User.findOne({userId: userId})
    .exec((err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message,
          result: ''
        })
      } else {
        let orderList = doc.orderList
        if (orderList.length > 0) {
          let orderTotal = 0
          orderList.forEach(item => {
            if (item.orderId === orderId) {
              orderTotal = item.orderTotal
            }
          })
          if (orderTotal > 0) {
            res.json({
              status: 0,
              msg: '操作成功',
              result: {
                orderId: orderId,
                orderTotal: orderTotal
              }
            })
          } else {
            res.json({
              status: 120002,
              msg: '无此订单',
              result: ''
            })
          }
        } else {
          res.json({
            status: 120001,
            msg: '用户没有订单',
            result: ''
          })
        }
      }
    })
})
// 查询商品数量
router.get('/getCartCount', (req, res, next) =>{
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId
    User.findOne({userId: userId})
      .exec((err, doc) => {
        if (err) {
          res.json({
            status: 1,
            msg: err.message,
            result: ''
          })
        } else {
          let cartList = doc.cartList
          let cartCount = 0
          cartList.forEach(item => {
            cartCount += parseInt(item.productNum)
          })
          res.json({
            status: 0,
            msg: '操作成功',
            result: cartCount
          })
        }
      })
  }
})
module.exports = router
