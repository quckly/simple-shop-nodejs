import { Router, Response, NextFunction } from 'express';
import { Collection, ObjectID } from 'mongodb';
import { QRequest } from '../model/QRequest';
import { QSession } from '../model/QSession';
import { RedisClient } from 'redis';

export class BasketComponent {
    router: Router;
    users: Collection;
    
    constructor(_db) {
        this.users = _db.collection('users');

        this.router = Router();
        this.init();
    }

    public createBasket(): any {
        return { items: {} };
    }

    public addProductToBasket(req: QRequest, res: Response) {
        if (!req.body || !req.body._id) {
            return res.status(400).json({ error: "Expect fields." });
        }

        let newProduct = req.body;

        this.getIntBasket(req).then(basket => {
            if (basket.items[newProduct._id]) {
                basket.items[newProduct._id].count = basket.items[newProduct._id].count + 1;
            } else {
                basket.items[newProduct._id] = {};
                basket.items[newProduct._id].product = newProduct;
                basket.items[newProduct._id].count = 1;
            }

            this.setIntBasket(req, basket).then(newBasket => {
                return res.json({ result: newBasket });
            }, err => {
                return res.status(400).json({ error: err });
            });
        }, err => {
            return res.status(400).json({ error: err });
        });
    }

    public getIntBasket(req: QRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            let user = req.session.user;

            if (!user) {
                if (req.session.basket) {
                    return resolve(req.session.basket);
                } else {
                    return resolve(this.createBasket());
                }
            } else {
                let basket = user.basket;

                if (req.session.basket) {
                    Object.keys(req.session.basket.items).forEach(key => {
                        let product: number = req.session.basket.items[key].product;
                        let value: number = req.session.basket.items[key].count;

                        if (basket.items[key]) {
                            basket.items[key].count = (basket.items[key].count || 0) + value;
                        } else {
                            basket.items[key] = {};
                            basket.items[key].product = product;
                            basket.items[key].count = value;
                        }
                    });

                    req.session.basket = null;

                    let redis: RedisClient = req.services['redis'];
                    redis.set('session_' + req.session.id, JSON.stringify(req.session), (err, r) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        return resolve(basket);
                    });

                    this.users.findOneAndUpdate({ id: user.id }, { "$set": { "basket": basket } }, (err, mongoRes) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(basket);
                    });
                } else {
                    return resolve(basket);
                }
            }
        });
    }

    public setIntBasket(req: QRequest, newBasket: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let user = req.session.user;

            if (!user) {
                req.session.basket = newBasket;

                let redis: RedisClient = req.services['redis'];
                redis.set('session_' + req.session.id, JSON.stringify(req.session), (err, r) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    return resolve(newBasket);
                });
            } else {
                user.basket = newBasket;

                this.users.findOneAndUpdate({ id: user.id }, { "$set": { "basket": newBasket }}, (err, mongoRes) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(newBasket);
                });
            }
        });
    }

    public getBasket(req: QRequest, res: Response) {
        this.getIntBasket(req).then(basket => {
            return res.json({ result: basket });
        }, err => {
            return res.status(400).json({ error: err });
        });
    }

    public putBasket(req: QRequest, res: Response) {
        if (!req.body) {
            return res.status(400).json({ error: "Expect fields." });
        }

        this.setIntBasket(req, req.body).then(newBasket => {
            return res.json({ result: newBasket });
        }, err => {
            return res.status(400).json({ error: err });
        });
    }

    init() {
        this.router.get('/', (req, res) => this.getBasket(req as QRequest, res));
        this.router.put('/', (req, res) => this.putBasket(req as QRequest, res));
        this.router.post('/add', (req, res) => this.addProductToBasket(req as QRequest, res));
    }

}
