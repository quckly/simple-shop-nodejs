"use strict";
const express = require("express");
const path = require("path");
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const uuidProvider = require('uuid/v1');
const redis_1 = require("redis");
const QSession_1 = require("./model/QSession");
const index_1 = require("./routes/index");
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let db;
const app = express();
const redisClient = redis_1.createClient();
//const mongoDbUrl = 'mongodb://shop-lab:hDrB8cGwN3jzN4YCCFw3qSSd@ds137530.mlab.com:37530/shop-lab';
const mongoDbUrl = 'mongodb://localhost/shopdb';
try {
    MongoClient.connect(mongoDbUrl, { native_parser: true }, function (err, _db) {
        if (err) {
            console.log("ERROR: " + err);
            throw err;
        }
        db = _db;
        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'pug');
        app.use(bodyParser.json());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(cookieParser());
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", req.headers['Origin'] || "http://localhost:4200");
            res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Vary", "Origin");
            next();
        });
        // Add services
        app.use((req, res, next) => {
            req.services = {};
            req.services['redis'] = redisClient;
            next();
        });
        // Lookup session from service
        app.use((req, res, next) => {
            let generateNewToken = () => {
                let uuid = uuidProvider();
                res.cookie("token", uuid);
                req.session = new QSession_1.QSession();
                req.session.id = uuid;
            };
            if (req.cookies['token'] !== undefined) {
                let token = req.cookies['token'];
                let redis = req.services['redis'];
                redis.get('session_' + token, (err, resSession) => {
                    if (err || resSession == null) {
                        generateNewToken();
                        return next();
                    }
                    else {
                        req.session = JSON.parse(resSession);
                        // Lookup user
                        if (req.session.user) {
                            _db.collection('users').findOne({ login: String(req.session.user.login) }).then(user => {
                                req.session.user = user;
                                return next();
                            }, err => {
                                return res.status(400).json({ error: err });
                            });
                        }
                        else {
                            return next();
                        }
                    }
                });
            }
            else {
                generateNewToken();
                return next();
            }
        });
        app.use('/', index_1.default(db));
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
            app.use((err, req, res, next) => {
                res.status(err['status'] || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }
        // production error handler
        // no stacktraces leaked to user
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    });
}
catch (err) {
    console.log("ERROR: " + err);
}
module.exports = app;
//# sourceMappingURL=app.js.map