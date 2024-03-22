import { FaultDetailComponent } from './faults/fault-detail/fault-detail.component';
import { CreateFaultComponent } from './faults/create-fault/create-fault.component';
import { RoomCalenderComponent } from './rooms/room-calender/room-calender.component';
import { CreateRoomComponent } from './rooms/create-room/create-room.component';
import { EditCustomerComponent } from './customers/edit-customer/edit-customer.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { CustomerActivitiesComponent } from './activities/customer-activities/customer-activities.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// layout
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/sidebar-menu.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { ActivitiesCalendarComponent } from './activities-calendar/activities-calendar.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditActivityComponent } from './activities/edit-activity/edit-activity.component';
import { CustomersComponent } from './customers/Customers.component';
import { RememberReportsComponent } from './remember-reports/remember-reports.component';
import { CreateActivityComponent } from './activities/create-activity/create-activity.component';
import { EyeToolComponent } from './eye-tool/eye-tool.component';
import { EyeHistoryComponent } from './eye-tool/eye-history/eye-history.component';
import { EyeResultComponent } from './eye-tool/eye-result/eye-result.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceLinesComponent } from './invoice-lines/invoice-lines.component';
import { GroupsComponent } from './groups/groups.component';
import { EditGroupComponent } from './groups/edit-group/edit-group.component';
import { CreateGroupComponent } from './groups/create-group/create-group.component';
import { InvitedActivitiesComponent } from './invited-activities/invited-activities.component';
import { ImportEconomicDataComponent } from './import-economic-data/import-economic-data.component';
import { AddEconomicGrantsComponent } from './import-economic-data/add-economic-grants/add-economic-grants.component';
import { CreateInvitedActivityComponent } from './invited-activities/create-invited-activity/create-invited-activity.component';
import { TasksComponent } from './tasks/tasks.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { ActivityInviteComponent } from './activity-invite/activity-invite.component';
import { CreateInviteComponent } from './activity-invite/create-invite/create-invite.component';
import { ActivityInviteDetailsComponent } from './activity-invite/activity-invite-details/activity-invite-details.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { PhoneCallActivityComponent } from './activities/phone-call-activity/phone-call-activity.component';
import { SmsActivityComponent } from './activities/sms-activity/sms-activity.component';
import { EmailActivityComponent } from './activities/email-activity/email-activity.component';
import { ProductGroupsComponent } from './product-groups/product-groups.component';
import { RoomsComponent } from './rooms/rooms.component';
import { CreateProductGroupComponent } from './product-groups/create-product-group/create-product-group.component';
import { EditProductGroupComponent } from './product-groups/edit-product-group/edit-product-group.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { CreateSupplierComponent } from './suppliers/create-supplier/create-supplier.component';
import { EditSupplierComponent } from './suppliers/edit-supplier/edit-supplier.component';
import { OrdersComponent } from './orders/orders.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { DetailsGroupComponent } from './groups/details-group/details-group.component';
import { CustomersGroupComponent } from './groups/customers-group/customers-group.component';
import { CustomerInvitesComponent } from './customers/customer-invites/customer-invites.component';
import { CustomerInviteDetailsComponent } from './customers/customer-invite-details/customer-invite-details.component';
import { FaultsComponent } from './faults/faults.component';
import { CreateInvoiceComponent } from './invoices/create-invoice/create-invoice.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { WebShopComponent } from './web-shop/web-shop.component';
import { SerialNoSelectionDialogComponent } from './web-shop/serial-no-selection-dialog/serial-no-selection-dialog.component';
import { CustomerBookingsComponent } from './customer-bookings/customer-bookings.component';
import { CreateCustomerBookingComponent } from './customer-bookings/create-customer-booking/create-customer-booking.component';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { CutomerBookingDetailsComponent } from './customer-bookings/cutomer-booking-details/cutomer-booking-details.component';
import { View_product_item_activity_dialogComponent } from './activities/view_product_item_activity_dialog/view_product_item_activity_dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
    // layout
    HeaderComponent,
    HeaderLeftNavbarComponent,
    HeaderLanguageMenuComponent,
    HeaderUserMenuComponent,
    FooterComponent,
    SidebarComponent,
    SidebarLogoComponent,
    SidebarUserPanelComponent,
    SidebarMenuComponent,
   // CalendarComponent,
    ActivitiesCalendarComponent,
    ActivitiesComponent,
    CustomersComponent,
    RememberReportsComponent,
    CustomerActivitiesComponent,
    EditActivityComponent,
    CreateActivityComponent,
    EyeToolComponent,
    EyeHistoryComponent,
    EyeResultComponent,
    CustomersComponent,
    CreateCustomerComponent,
    EditCustomerComponent,
    InvoicesComponent,
    InvoiceLinesComponent,
    GroupsComponent,
    EditGroupComponent,
    CreateGroupComponent,
    InvitedActivitiesComponent,
    ImportEconomicDataComponent,
    AddEconomicGrantsComponent,
    CreateInvitedActivityComponent,
    TasksComponent,
    CreateTaskComponent,
    ActivityInviteComponent,
    CreateInviteComponent,
    ActivityInviteDetailsComponent,
    CustomerDetailsComponent,
    PhoneCallActivityComponent,
    SmsActivityComponent,
    EmailActivityComponent,
    ProductGroupsComponent,
    EmailActivityComponent,
    RoomsComponent,
    CreateRoomComponent,
    RoomCalenderComponent,
    CreateProductGroupComponent,
    EditProductGroupComponent,
    SuppliersComponent,
    CreateSupplierComponent,
    EditSupplierComponent,
    OrdersComponent,
    CreateOrderComponent,
    EditOrderComponent,
    DetailsGroupComponent,
    CustomersGroupComponent,
    CustomerInvitesComponent,
    CustomerInviteDetailsComponent,
    FaultsComponent,
    CreateFaultComponent,
    CreateInvoiceComponent,
      LandingPageComponent,
      WebShopComponent,
      CustomerBookingsComponent,
      CreateCustomerBookingComponent,
      CartItemsComponent,
      CutomerBookingDetailsComponent,
      FaultDetailComponent,
      SerialNoSelectionDialogComponent,
      View_product_item_activity_dialogComponent
   ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    TypeaheadModule.forRoot(),
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    // }),


  ],
  providers: [ActivityServiceProxy, DatePipe],
  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,
    CreateOrderComponent,
    EditOrderComponent,
    //fault
    CreateFaultComponent,
    View_product_item_activity_dialogComponent
  ],
})
export class AppModule { }
