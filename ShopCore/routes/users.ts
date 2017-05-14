import { Router, Response, NextFunction } from 'express';
import { Collection, ObjectID } from 'mongodb';
import { QRequest } from '../model/QRequest';

export class UsersRouter {
    router: Router;
    users: Collection;

    constructor(_db) {
        this.users = _db.collection('users');

        this.router = Router();
        this.init();
    }
    
    public getAll(req: QRequest, res: Response) {
        this.users.find().toArray((err, items) => {
            res.json(items);
        });
    }
    
    init() {
        this.router.get('/', this.getAll);

        this.router.get('/:id', ((req: QRequest, res: Response) => {
            //if (!ObjectID.isValid(req.params.id)) {
            //    return res.json({ error: "Not valid id" });
            //}

            this.users.findOne({ _id: req.params.id },
                (err, result) => {
                    res.json({ error: err, result: result });
                });
        }));

        this.router.post('/', ((req: QRequest, res: Response) => {
            this.users.insertOne(req.body,
                (err, result) => {
                    res.json({ error: err, id: result.insertedId });
                });
        }));
    }

}

export default ((db) => {
    let r = new UsersRouter(db);
    return r.router;
});
