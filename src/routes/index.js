module.exports = function routes(app) {
  app.use('/csr/*.html', (req, res, next) => {
    req.query.__csr = 1
    next()
  })

  /* health check point */
  app.use('/ok', (req, res, next) => {
    res.sendStatus(200)
  })
}
