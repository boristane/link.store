var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
var apiRouter = require('./routes/api');

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Routes
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
});

app.listen(PORT, function () {
    console.log("Running in port " + PORT);
});