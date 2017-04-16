import {Component, View, NgFor} from 'angular2/angular2';
import { _settings } from '../../settings'
import {ProductsService} from "../../services/productsService";
import {Inject} from 'angular2/di';

@Component({
  selector: 'home',
  injectables: [ProductsService]
})
@View({
  templateUrl: _settings.buildPath + "/components/home/home.html",
  directives: [NgFor]
})
export class Home {
  newProducts: Array<any>;

  constructor( @Inject(ProductsService) private productsService: ProductsService) {
      //productsService.getNewProducts()
      //.map(r => r.json())
      //.subscribe(a => {
      //    this.newProducts = a;
      //});
      this.newProducts = [{ "Name": "Product 1", "Price": 4200, "Photo": "" }, { "Name": "Product 2", "Price": 4200 }, { "Name": "Product 3", "Price": 4200 }];
  }
}