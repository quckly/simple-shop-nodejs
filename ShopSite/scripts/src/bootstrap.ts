// Angular2
import { bootstrap } from 'angular2/angular2';
// Angular2 Router Injectables https://github.com/angular/angular/blob/f999d5a1566d3b830fd1a23ed554cbed4e1215e8/modules/angular2/router.ts
import { routerInjectables } from 'angular2/router';
import { ProductsService } from "./services/productsService"
import { CategoriesService } from "./services/categoriesService"
import { UsersService } from "./services/usersService"
import { BasketService } from "./services/basketService"
import { httpInjectables } from 'angular2/http';
import { formInjectables } from 'angular2/forms';

import { MyApp } from './components/app/app';

// Second parameter provides a set of additional bindings 
// that will be used by Component (in our case application)
// read more here: https://angular.io/docs/js/latest/api/core/bootstrap-function.html
bootstrap(MyApp, [routerInjectables, httpInjectables, formInjectables, ProductsService, CategoriesService, UsersService, BasketService]);
