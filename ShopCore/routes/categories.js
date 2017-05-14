"use strict";
const express_1 = require("express");
const router = express_1.Router();
let exportRoute = (db) => {
    let categories = db.collection('categories');
    router.get('/', ((req, res) => {
        categories.find().toArray((err, items) => {
            res.json({ result: items });
        });
    }));
    router.get('/:id', ((req, res) => {
        //if (!ObjectID.isValid(req.params.id)) {
        //    res.json({ error: "Not valid id" });
        //    return;
        //}
        categories.findOne({ _id: req.params.id }, (err, result) => {
            res.json({ error: err, result: result });
        });
    }));
    router.post('/', ((req, res) => {
        categories.insertOne(req.body, (err, result) => {
            res.json({ error: err, id: result.insertedId });
        });
    }));
    return router;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exportRoute;
//# sourceMappingURL=categories.js.map