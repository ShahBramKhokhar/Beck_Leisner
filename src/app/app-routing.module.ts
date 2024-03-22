import { FaultDetailComponent } from './faults/fault-detail/fault-detail.component';
import { FaultsComponent } from './faults/faults.component';
import { OrdersComponent } from './orders/orders.component';
import { RoomCalenderComponent } from './rooms/room-calender/room-calender.component';
import { RoomsComponent } from './rooms/rooms.component';
import { InvoiceLinesComponent } from './invoice-lines/invoice-lines.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { CustomerActivitiesComponent } from './activities/customer-activities/customer-activities.component';
import { ActivitiesCalendarComponent } from './activities-calendar/activities-calendar.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ActivitiesComponent } from './activities/activities.component';
import { CustomersComponent } from './customers/Customers.component';
import { RememberReportsComponent } from './remember-reports/remember-reports.component';
import { EyeToolComponent } from './eye-tool/eye-tool.component';
import { GroupsComponent } from './groups/groups.component';
import { InvitedActivitiesComponent } from './invited-activities/invited-activities.component';
import { ImportEconomicDataComponent } from './import-economic-data/import-economic-data.component';
import { ActivityInviteDetailsComponent } from './activity-invite/activity-invite-details/activity-invite-details.component';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { ProductGroupsComponent } from './product-groups/product-groups.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { PhoneCallActivityComponent } from './activities/phone-call-activity/phone-call-activity.component';
import { SmsActivityComponent } from './activities/sms-activity/sms-activity.component';
import { EmailActivityComponent } from './activities/email-activity/email-activity.component';
import { EditGroupComponent } from './groups/edit-group/edit-group.component';
import { CustomerInviteDetailsComponent } from './customers/customer-invite-details/customer-invite-details.component';
import { CustomerBookingsComponent } from './customer-bookings/customer-bookings.component';
import { CreateCustomerBookingComponent } from './customer-bookings/create-customer-booking/create-customer-booking.component';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { CutomerBookingDetailsComponent } from './customer-bookings/cutomer-booking-details/cutomer-booking-details.component';
import { WebShopComponent } from './web-shop/web-shop.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent, canActivate: [AppRouteGuard] },
                    { path: 'customers', component: CustomersComponent, canActivate: [AppRouteGuard] },
                    { path: 'customer/activities/:customerId', component: CustomerActivitiesComponent, canActivate: [AppRouteGuard] },
                    { path: 'activities', component: ActivitiesComponent, canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
                    { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] },
                    { path: 'activities-calendar', component: ActivitiesCalendarComponent, canActivate: [AppRouteGuard] },
                    { path: 'employee-remember-reports', component: RememberReportsComponent, canActivate: [AppRouteGuard] },
                    { path: 'eye-tool/:activityId', component: EyeToolComponent, canActivate: [AppRouteGuard] },
                    { path: 'sales', component: InvoicesComponent, canActivate: [AppRouteGuard] },
                    { path: 'sales/:id', component: InvoiceLinesComponent, canActivate: [AppRouteGuard] },
                    { path: 'groups', component: GroupsComponent, canActivate: [AppRouteGuard] },
                    { path: 'invited-activities/:groupId', component: InvitedActivitiesComponent, canActivate: [AppRouteGuard] },
                    { path: 'import-economic-data', component: ImportEconomicDataComponent, canActivate: [AppRouteGuard] },
                    { path: 'activity-invite-details', component: ActivityInviteDetailsComponent, canActivate: [AppRouteGuard] },
                    { path: 'customer-details/:id', component: CustomerDetailsComponent, canActivate: [AppRouteGuard] },
                    // { path: 'products', component: ProductsComponent, canActivate: [AppRouteGuard] },
                    { path: 'product-groups', component: ProductGroupsComponent, canActivate: [AppRouteGuard] },
                    { path: 'rooms', component: RoomsComponent, canActivate: [AppRouteGuard] },
                    { path: 'room-calender/:id', component: RoomCalenderComponent, canActivate: [AppRouteGuard] },
                    { path: 'suppliers', component: SuppliersComponent, canActivate: [AppRouteGuard] },
                    { path: 'orders', component: OrdersComponent, canActivate: [AppRouteGuard] },

                    { path: 'phoneCallActivity', component: PhoneCallActivityComponent, canActivate: [AppRouteGuard] },
                    { path: 'smsActivity', component: SmsActivityComponent, canActivate: [AppRouteGuard] },
                    { path: 'emailActivity', component: EmailActivityComponent, canActivate: [AppRouteGuard] },
                    { path:'editGroupCustomers/:id',component:EditGroupComponent,canActivate:[AppRouteGuard]},
                    { path:'faults',component:FaultsComponent,canActivate:[AppRouteGuard]},
                    {path:'customer-invites-details',component:CustomerInviteDetailsComponent,canActivate:[AppRouteGuard]},
                    // {path:'web-shop',component:WebShopComponent,canActivate:[AppRouteGuard]},
                    {path:'Add-booking',component:CreateCustomerBookingComponent,canActivate:[AppRouteGuard]},
                    {path:'bookings',component:CustomerBookingsComponent,canActivate:[AppRouteGuard]},
                    {path:'cart-items',component:CartItemsComponent,canActivate:[AppRouteGuard]},
                    {path:'booking-detail',component:CutomerBookingDetailsComponent,canActivate:[AppRouteGuard]},
                    {path:'fault-detail',component:FaultDetailComponent,canActivate:[AppRouteGuard]},
                    {path:'web-shop',component:WebShopComponent,canActivate:[AppRouteGuard]}

                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
