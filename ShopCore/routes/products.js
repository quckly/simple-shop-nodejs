"use strict";
const express_1 = require("express");
const router = express_1.Router();
let getMongoSortFromStr = (order) => {
    if (/^desc/.test(order.toLowerCase())) {
        return -1;
    }
    return 1;
};
let exportRoute = (db) => {
    let products = db.collection('products');
    router.get('/', ((req, res) => {
        let priceOrder = null;
        let dbQuery = new Object();
        if (req.query.cat != undefined) {
            dbQuery.cat = +req.query.cat;
        }
        let cursor = products.find(dbQuery);
        if (req.query.priceOrder != undefined) {
            cursor.sort({ price: getMongoSortFromStr(req.query.priceOrder) });
        }
        cursor.toArray((err, items) => {
            res.json({ result: items });
        });
    }));
    router.get('/new', ((req, res) => {
        products.find().toArray((err, items) => {
            res.json({ result: items });
        });
    }));
    router.get('/top', ((req, res) => {
        products.find().toArray((err, items) => {
            res.json({ result: items });
        });
    }));
    router.get('/:id', ((req, res) => {
        //if (!ObjectID.isValid(req.params.id)) {
        //    res.json({ error: "Not valid id" });
        //    return;
        //}
        products.findOne({ _id: req.params.id }, (err, result) => {
            res.json({ error: err, result: result });
        });
    }));
    router.post('/', ((req, res) => {
        if (req.session.user == undefined || req.session.user.role !== "Admin") {
            res.json({ error: "Only admin." });
            return;
        }
        products.insertOne(req.body, (err, result) => {
            res.json({ error: err, id: result.insertedId });
        });
    }));
    return router;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exportRoute;
//# sourceMappingURL=products.js.map