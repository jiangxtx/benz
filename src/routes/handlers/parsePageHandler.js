const PRE_RENDER_REGX = /_pre_render(\.html)?$/

module.exports = (req, res, next) => {
  let page = req.params.page || ''
  page = page.replace(PRE_RENDER_REGX, '')
  res.locals.page = page
  next()
}
