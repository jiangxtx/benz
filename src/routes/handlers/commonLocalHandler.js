/**
 * 可在此添加全局的locals配置
 */
module.exports = function (req, res, next) {
  res.locals.__eruda = true
  next()
}
