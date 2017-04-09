import * as express from "express";
import users from './users';
import categories from './categories';
import products from './products';

let exportRoute = (db) => {
    const router = express.Router();
    
    router.use('/users', users(db));
    router.use('/categories', categories(db));
    router.use('/products', products(db));

    router.get('/',
        (req: express.Request, res: express.Response) => {
            res.render('index', { title: db });
        });

    return router;
};

export default exportRoute;
