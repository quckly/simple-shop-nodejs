import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { ProfileComponent } from './users/profile/profile.component';
import { BasketComponent } from './basket/basket.component';
import { ProfileEmbeddedComponent } from './profile-embedded/profile-embedded.component';

import { BasketService } from './services/basket.service';
import { ProductsService } from './services/products.service';
import { CategoriesService } from './services/categories.service';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'product/:id', component: ProductComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'basket', component: BasketComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductComponent,
    RegisterComponent,
    ProfileComponent,
    LoginComponent,
    BasketComponent,
    //CategoriesComponent,
    ProductsComponent,
    ProfileEmbeddedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [BasketService, ProductsService, CategoriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
