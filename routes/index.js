const vehicles = require('./vehicles')

module.exports = (app) => {
    app.get('/', function (request, response) {
        response.render('pages/index')
    })
    app.use('/vehicles', vehicles)
}