import * as express from "express";
import * as path from 'path';
const bodyParser = require('body-parser');

import indexRoutes from './routes/index';

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

var db;
var app = express();

var mongoDbUrl = 'mongodb://shop-lab:hDrB8cGwN3jzN4YCCFw3qSSd@ds137530.mlab.com:37530/shop-lab';
MongoClient.connect(mongoDbUrl, { native_parser: true }, function (err, _db) {
    if (err) {
        throw err;
    }

    db = _db;

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRoutes(db));

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use((err: any, req, res, next) => {
            res.status(err['status'] || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use((err: any, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
});

module.exports = app;
