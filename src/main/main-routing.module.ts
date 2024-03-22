import { ThankYouComponent } from './../shared/components/thank-you/thank-you.component';
import { ProductsComponent } from './products/products.component';
import { MainpageComponent } from './mainpage/mainpage.component';
// import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateBookingComponent } from './create-booking/create-booking.component';

@NgModule({
    imports: [
        // RouterModule.forChild([
        //     { path: '',component: MainpageComponent, },
        //     { path: 'products', component: ProductsComponent },
        //     { path: 'add-booking',  component: CreateBookingComponent},
        // ])
    ],
    exports: [
        RouterModule
    ],
})

export class MainRoutingModule { }
