"use strict";
const express_1 = require("express");
const mongodb_1 = require("mongodb");
class UsersRouter {
    constructor(_db) {
        this.users = _db.collection('users');
        this.router = express_1.Router();
        this.init();
    }
    getAll(req, res) {
        this.users.find().toArray((err, items) => {
            res.json(items);
        });
    }
    init() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', ((req, res) => {
            if (!mongodb_1.ObjectID.isValid(req.params.id)) {
                return res.json({ error: "Not valid id" });
            }
            this.users.findOne({ _id: new mongodb_1.ObjectID(req.params.id) }, (err, result) => {
                res.json({ error: err, result: result });
            });
        }));
        this.router.post('/', ((req, res) => {
            this.users.insertOne(req.body, (err, result) => {
                res.json({ error: err, id: result.insertedId });
            });
        }));
    }
}
exports.UsersRouter = UsersRouter;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ((db) => {
    let r = new UsersRouter(db);
    return r.router;
});
//# sourceMappingURL=users.js.map