import { Router, Response, NextFunction } from 'express';
import { Collection, ObjectID } from 'mongodb';
import { QRequest } from '../model/QRequest';
import { QSession } from '../model/QSession';
import { randomBytes, createHmac, } from 'crypto';
import { RedisClient } from 'redis';

export class LoginComponent {
    router: Router;
    users: Collection;

    constructor(_db) {
        this.users = _db.collection('users');

        this.router = Router();
        this.init();
    }

    public getPublicUser(user: any) {
        let result: any = new Object();

        result.login = user.login;
        result.id = user.id;
        result.cart = user.cart;
        result.orders = user.orders;

        return result;
    }

    public genRandomString(length: number) {
        return randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);   /** return required number of characters */
    }

    public genHashPassword(password, salt) {
        let hash = createHmac('sha256', salt);
        hash.update(password);
        return hash.digest('hex');
    };
    
    public getProfile(req: QRequest, res: Response) {
        let user = req.session.user;

        if (user != null) {
            res.json({ result: { auth: true, user: this.getPublicUser(user) } });
        } else {
            res.json({
                result: {
                    auth: false
                }
            });
        }
    }

    public postLogin(req: QRequest, res: Response) {
        if (!req.body || !req.body.login || !req.body.password) {
            res.location('/login');
            return res.status(400).json({ error: "Expect fields." });
        }


    }

    public postRegister(req: QRequest, res: Response) {
        if (!req.body || !req.body.login || !req.body.password) {
            res.location('/register');
            return res.status(400).json({ error: "Expect fields." });
        }

        this.users.find({ login: String(req.body.login) }).count(true, (err, c) => {
            if (c > 0) {
                return res.status(400).json({ error: "User already registered." });
            }

            let user: any = {};
            user.login = req.body.login;
            user.salt = this.genRandomString(16);
            user.password = this.genHashPassword(req.body.password, user.salt);
            user.cart = [];
            user.orders = []

            this.users.insertOne(user, (err, r) => {
                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    // Set session
                    req.session.user = user;
                    let redis: RedisClient = req.services['redis'];
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
        this.router.get('/profile', this.getProfile);
        this.router.post('/', this.postLogin);

        this.router.post('/register', this.postRegister);
    }

}
