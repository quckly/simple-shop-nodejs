import * as express from "express";
import { QRequest } from '../model/QRequest';
import users from './users';
import categories from './categories';
import products from './products';
import { LoginComponent } from './login'
import { BasketComponent } from './basket'

let exportRoute = (db) => {
    const router = express.Router();
    
    router.use('/users', users(db));
    router.use('/login', new LoginComponent(db).router);
    router.use('/basket', new BasketComponent(db).router);
    router.use('/categories', categories(db));
    router.use('/products', products(db));

    router.get('/',
        (req: QRequest, res: express.Response) => {
            res.render('index', { title: db });
        });

    return router;
};

export default exportRoute;
