import { ThankYouComponent } from './../shared/components/thank-you/thank-you.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { MainpageComponent } from 'main/mainpage/mainpage.component';
import { ProductsComponent } from 'main/products/products.component';
import { CreateBookingComponent } from 'main/create-booking/create-booking.component';
import { MainComponent } from 'main/main.component';
import { AccountAboutComponent } from './account-about/account-about.component';
import { AccountContactComponent } from './account-contact/account-contact.component';
import { AccountTeamComponent } from './account-team/account-team.component';
import { AccountPortfolioComponent } from './account-portfolio/account-portfolio.component';
import { WebShopComponent } from '@app/web-shop/web-shop.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MainComponent,
                //component: AccountComponent,
                children: [
                    { path: '', component: MainpageComponent },
                    { path: 'login', component: AccountComponent },
                    { path: 'register', component: RegisterComponent },
                    { path: 'products', component: ProductsComponent },
                    { path: 'add-booking',  component: CreateBookingComponent},
                    { path: 'thank-you',  component: ThankYouComponent},
                    {path:'about',component:AccountAboutComponent},
                    {path:'contact',component:AccountContactComponent},
                    {path:'team',component:AccountTeamComponent},
                    {path:'portfolio',component:AccountPortfolioComponent},
                    { path: 'WebShop', component: ProductsComponent },
                    { path: 'AddBooking', component:CreateBookingComponent },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
