let resJ = (status, msg, result, res) => {
  return res.json({
    status: parseInt(status), // 默认 1出错， 0正常
    msg: msg,
    result: result ? result : ''
  })
}

module.exports = resJ