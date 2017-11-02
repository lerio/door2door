const express = require('express')
const mountRoutes = require('./routes')

const app = express()
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
mountRoutes(app)

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
})
