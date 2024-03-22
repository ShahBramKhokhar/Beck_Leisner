import { ThankYouComponent } from './../shared/components/thank-you/thank-you.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccountRoutingModule } from './account-routing.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountLanguagesComponent } from './layout/account-languages.component';
import { AccountHeaderComponent } from './layout/account-header.component';
import { AccountFooterComponent } from './layout/account-footer.component';

// tenants
import { TenantChangeComponent } from './tenant/tenant-change.component';
import { TenantChangeDialogComponent } from './tenant/tenant-change-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MainComponent } from 'main/main.component';
import { MainpageComponent } from 'main/mainpage/mainpage.component';
import { CreateBookingComponent } from 'main/create-booking/create-booking.component';
import { MainHeaderComponent } from 'main/main-header/main-header.component';
import { MainFooterComponent } from 'main/main-footer/main-footer.component';
import { ProductsComponent } from 'main/products/products.component';
import { CreateProductComponent } from 'main/products/create-product/create-product.component';
import { EditProductComponent } from 'main/products/edit-product/edit-product.component';
import { AccountContactComponent } from  './account-contact/account-contact.component';
import { AccountTeamComponent } from './account-team/account-team.component';
import { AccountPortfolioComponent } from './account-portfolio/account-portfolio.component'
import { AccountAboutComponent } from './account-about/account-about.component';


@NgModule({
    declarations: [
        AccountComponent,
        LoginComponent,
        RegisterComponent,
        AccountLanguagesComponent,
        AccountHeaderComponent,
        AccountFooterComponent,
        // tenant
        TenantChangeComponent,
        TenantChangeDialogComponent,
        MainComponent,
        MainpageComponent,
        CreateBookingComponent,
        MainHeaderComponent,
        MainFooterComponent,
        ProductsComponent,
        CreateProductComponent,
        EditProductComponent,
        ThankYouComponent,
         AccountContactComponent, 
         AccountTeamComponent, 
         AccountPortfolioComponent, AccountAboutComponent
    ],
    providers: [DatePipe],
    entryComponents: [
        // tenant
        TenantChangeDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        SharedModule,
        ServiceProxyModule,
        AccountRoutingModule,
        NgxPaginationModule,
        ModalModule.forChild(),

    ]
})
export class AccountModule {

}
