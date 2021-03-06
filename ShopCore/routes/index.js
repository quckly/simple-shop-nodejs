"use strict";
const express = require("express");
const users_1 = require("./users");
const categories_1 = require("./categories");
const products_1 = require("./products");
const login_1 = require("./login");
const basket_1 = require("./basket");
let exportRoute = (db) => {
    const router = express.Router();
    router.use('/users', users_1.default(db));
    router.use('/login', new login_1.LoginComponent(db).router);
    router.use('/basket', new basket_1.BasketComponent(db).router);
    router.use('/categories', categories_1.default(db));
    router.use('/products', products_1.default(db));
    router.get('/', (req, res) => {
        res.render('index', { title: db });
    });
    return router;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exportRoute;
//# sourceMappingURL=index.js.map