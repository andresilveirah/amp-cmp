module.exports = (req, _res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`)
  next()
}
