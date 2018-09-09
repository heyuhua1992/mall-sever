var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var app = express();
// 连接数据库
var connect = (require('./connect/connect'))()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.cookies.userId) {
    next()
  } else if (req.path === '/users/login' || req.path === '/users/logout' || req.path === '/goods/list') {
    next()
  } else {
    res.json({
      status: 10401,
      msg: 'filter,当前未登录',
      result: ''
    })
    // 401 用户需要验证
    next(createError(401))
  }
})
// 一级入口
app.use('/goods', require('./routes/goods'));
app.use('/users',  require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
