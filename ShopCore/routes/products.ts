import { Router, Request, Response, NextFunction } from 'express';
import { Collection, ObjectID } from 'mongodb';
import { QRequest } from '../model/QRequest';
import { RedisClient } from 'redis';
const router = Router();

let getMongoSortFromStr = (order: string) => {
    if (/^desc/.test(order.toLowerCase())) {
        return -1;
    }

    return 1;
}

let exportRoute = (db) => {
    let products: Collection = db.collection('products');

    router.get('/', ((req: QRequest, res: Response) => {
        let priceOrder: string = null;
        let dbQuery: any = new Object();

        if (req.query.cat != null) {
            dbQuery.cat = +req.query.cat;
        }

        if (req.query.query != null) {
            dbQuery['$or'] = [{ "name": { "$regex": req.query.query, "$options": 'i' } },
                { "description": { "$regex": req.query.query, "$options": 'i' } }];
        }
        
        let cursor = products.find(dbQuery);

        if (req.query.priceOrder != undefined) {
            cursor.sort({ price: getMongoSortFromStr(req.query.priceOrder) });
        }

        cursor.toArray((err, items) => {
            res.json({ result: items });
        });
    }));

    router.get('/new', ((req: QRequest, res: Response) => {
        products.find().toArray((err, items) => {
            res.json({ result: items });
        });
    }));

    router.get('/top', ((req: QRequest, res: Response) => {
        let redis: RedisClient = req.services['redis'];

        redis.get('cache_top', (err, resItems) => {
            if (err || resItems == null) {
                products.find().toArray((err, items) => {
                    items.forEach(v => {
                        v.description = v.description + 'Cached: ' + new Date();
                    });

                    redis.setex('cache_top', 60, JSON.stringify(items), (err, redisRes) => {
                        res.json({ result: items });
                    });
                });
            } else {
                let result = JSON.parse(resItems);
                return res.json({ result: result });
            }
        });
    }));

    router.get('/:id', ((req: QRequest, res: Response) => {
        //if (!ObjectID.isValid(req.params.id)) {
        //    res.json({ error: "Not valid id" });
        //    return;
        //}

        products.findOne({ _id: +req.params.id },
            (err, result) => {
                if (!result) {
                    return res.status(404).json({ error: "Not found" });
                }

                return res.json({ error: err, result: result });
            });
    }));

    router.post('/', ((req: QRequest, res: Response) => {
        if (req.session.user == undefined || req.session.user.role !== "Admin") {
            res.json({ error: "Only admin." });
            return;
        }

        products.insertOne(req.body,
            (err, result) => {
                res.json({ error: err, id: result.insertedId });
            });
    }));

    return router;
};

export default exportRoute;
