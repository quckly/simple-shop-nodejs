var express = require('express');

var app = express();

app.use(express.static('public'));
app.use(require('connect-livereload')());

app.listen(8000, function () {
    console.log('Express server started!!!');
});
