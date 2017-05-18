import * as express from "express";
import * as path from 'path';
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const uuidProvider = require('uuid/v1');
import { RedisClient, createClient } from 'redis';
import { QRequest } from './model/QRequest';
import { QSession } from './model/QSession';

import indexRoutes from './routes/index';

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let db;
const app = express();

const redisClient = createClient();

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

//const mongoDbUrl = 'mongodb://shop-lab:hDrB8cGwN3jzN4YCCFw3qSSd@ds137530.mlab.com:37530/shop-lab';
const mongoDbUrl = 'mongodb://localhost/shopdb'

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

        app.use(cookieParser())

        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", req.headers['Origin'] || "http://localhost:4200");
            res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Vary", "Origin");
            next();
        });

        // Add services
        app.use((req: QRequest, res: express.Response, next: express.NextFunction) => {
            req.services = {};
            req.services['redis'] = redisClient;
            next();
        });

        // Lookup session from service
        app.use((req: QRequest, res: express.Response, next: express.NextFunction) => {
            let generateNewToken = () => {
                let uuid = uuidProvider();
                res.cookie("token", uuid);
                req.session = new QSession();
                req.session.id = uuid;
            }

            if (req.cookies['token'] !== undefined) {
                let token: string = req.cookies['token'];
                let redis: RedisClient = req.services['redis'];

                redis.get('session_' + token, (err, resSession) => {
                    if (err || resSession == null) {
                        generateNewToken();
                        return next();
                    } else {
                        req.session = JSON.parse(resSession);

                        // Lookup user
                        if (req.session.user) {
                            _db.collection('users').findOne({ login: String(req.session.user.login) }).then(user => {
                                req.session.user = user;

                                return next();
                            }, err => {
                                return res.status(400).json({ error: err })
                            });
                        } else {
                            return next();
                        }
                    }
                });
            } else {
                generateNewToken();
                return next();
            }
        });

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
} catch (err) {
    console.log("ERROR: " + err);
}

module.exports = app;
