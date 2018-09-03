const express = require('express');
const router = express.Router();
const User = require('../models/user')

/**
 *登陆接口
 */
router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param).select({userId: 1, userPwd: 1, userName: 1}).exec((err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
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
    msg: '',
    result: ''
  })
})
// 检查是否登陆
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: 0,
      msg: '',
      result: {
        userName: req.cookies.userName,
        userId: req.cookies.userId
      }
    })
  } else {
    res.json({
      status: 1,
      msg: '未登录',
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
        if (!doc) { return }
        res.json({
          status: 0,
          msg: '',
          result: doc.cartList
        })
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
          msg: '',
          result: 'suc'
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
        msg: '',
        result: 'suc'
      })
    }
  }) 
})
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
              msg: '',
              result: 'suc'
            })
          }
        })
      }
    })
})
module.exports = router;
