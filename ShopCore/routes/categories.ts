import { Router, Request, Response, NextFunction } from 'express';
import { Collection, ObjectID } from 'mongodb';
const router = Router();

let exportRoute = (db) => {
    let categories: Collection = db.collection('categories');

    router.get('/', ((req: Request, res: Response) => {
        categories.find().toArray((err, items) => {
            res.json({ result: items });
        });
    }));

    router.get('/:id', ((req: Request, res: Response) => {
        //if (!ObjectID.isValid(req.params.id)) {
        //    res.json({ error: "Not valid id" });
        //    return;
        //}

        categories.findOne({ _id: req.params.id },
            (err, result) => {
                res.json({ error: err, result: result });
            });
    }));

    router.post('/', ((req: Request, res: Response) => {
        categories.insertOne(req.body,
            (err, result) => {
                res.json({ error: err, id: result.insertedId });
            });
    }));

    return router;
};

export default exportRoute;
