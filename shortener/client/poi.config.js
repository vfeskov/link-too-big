module.exports = {
  html: {
    template: 'index.ejs'
  },
  devServer: {
    proxy: 'http://localhost:20000/api'
  }
}
