var express = require('express');
var app = express();

app.get('/', function (req, res) {
    // res.send('Hello World!');
    res.sendFile('C:/Users/Bryan Bu/Desktop/Internettechnologien/einfacher-express-server.html');
});

app.listen(3000, function () {
    console.log('Example app listening on 3000!');
})