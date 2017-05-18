"use strict";
const express_1 = require("express");
const crypto_1 = require("crypto");
class LoginComponent {
    constructor(_db) {
        this.users = _db.collection('users');
        this.router = express_1.Router();
        this.init();
    }
    getPublicUser(user) {
        let result = new Object();
        result.login = user.login;
        result.id = user.id;
        result.orders = user.orders;
        return result;
    }
    genRandomString(length) {
        return crypto_1.randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length); /** return required number of characters */
    }
    genHashPassword(password, salt) {
        let hash = crypto_1.createHmac('sha256', salt);
        hash.update(password);
        return hash.digest('hex');
    }
    ;
    getProfile(req, res) {
        let user = req.session.user;
        if (user != null) {
            res.json({ result: { auth: true, user: this.getPublicUser(user) } });
        }
        else {
            res.json({
                result: {
                    auth: false
                }
            });
        }
    }
    postLogin(req, res) {
        if (!req.body || !req.body.login || !req.body.password) {
            //res.location('/login');
            return res.status(400).json({ error: "Expect fields." });
        }
        this.users.findOne({ login: String(req.body.login) }).then(user => {
            let tryPassword = this.genHashPassword(req.body.password, user.salt);
            if (user.password != tryPassword) {
                return res.status(400).json({ error: "User not found. Or password incorrect." });
            }
            // Set session
            req.session.user = user;
            let redis = req.services['redis'];
            redis.set('session_' + req.session.id, JSON.stringify(req.session), (err, r) => {
                if (err) {
                    res.json({ error: err });
                    return;
                }
                res.json({ result: this.getPublicUser(user) });
            });
        }, error => {
            return res.status(400).json({ error: "User not found. Or password incorrect." });
        });
    }
    postRegister(req, res) {
        if (!req.body || !req.body.login || !req.body.password) {
            //res.location('/register');
            return res.status(400).json({ error: "Expect fields." });
        }
        this.users.find({ login: String(req.body.login) }).count(true, (err, c) => {
            if (c > 0) {
                return res.status(400).json({ error: "User already registered." });
            }
            let user = {};
            user.login = req.body.login;
            user.salt = this.genRandomString(16);
            user.password = this.genHashPassword(req.body.password, user.salt);
            user.basket = { items: {} };
            user.orders = [];
            this.users.insertOne(user, (err, r) => {
                if (err) {
                    res.status(400).json({ error: err });
                }
                else {
                    // Set session
                    req.session.user = user;
                    let redis = req.services['redis'];
                    redis.set('session_' + req.session.id, JSON.stringify(req.session), (err, r) => {
                        if (err) {
                            res.json({ error: err });
                            return;
                        }
                        res.json({ result: "Ok" });
                    });
                }
            });
        });
    }
    init() {
        this.router.get('/profile', (req, res) => this.getProfile(req, res));
        this.router.post('/', (req, res) => this.postLogin(req, res));
        this.router.post('/register', (req, res) => this.postRegister(req, res));
    }
}
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.js.map