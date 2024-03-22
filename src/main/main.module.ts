import { CreateBookingComponent } from './create-booking/create-booking.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { SharedModule } from './../shared/shared.module';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MainRoutingModule,
    SharedModule,
    NgxPaginationModule
  ],
  declarations: [
    MainComponent,
    MainpageComponent,
    CreateBookingComponent,
    MainHeaderComponent,
    MainFooterComponent,
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent
  ],
   providers: [DatePipe]
})
export class MainModule { }
