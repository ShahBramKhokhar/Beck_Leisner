import { BookingActivityTypeDto } from './../../shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { UserTypes } from '@shared/AppConsts';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { DateHelper } from '@shared/helpers/DateHelper';
import { CreateBookingDto, UserTypeDto, UserDto, BookingServiceProxy, UserServiceProxy, UserTypeServiceProxy, CreateCustomerDto, RoleDto, CustomerServiceProxy, CustomFieldServiceProxy, ActivityServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { id } from 'date-fns/locale';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css'],
  animations: [appModuleAnimation()],
  providers:[DatePipe]
})
export class CreateBookingComponent extends AppComponentBase implements OnInit {

  saving = false;
  createBooking  = new CreateBookingDto();
  userTypes: UserTypeDto[] = [];
  employees:UserDto[]=[];
  selectedIndex? : number|undefined;
  customerId:number;
  imgNotFoundUrl:string = '../assets/img/image-not-found.png'
  startDate: Date;
  customer = new CreateCustomerDto();
  roles: RoleDto[] = [];
  bookingActivityTypes: BookingActivityTypeDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  isCustomFieldsAvailable=false;
  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
      'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

  @Output() onSave = new EventEmitter<any>();
  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private bookingService:BookingServiceProxy,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    private _datePipe: DatePipe,
    public _customerService: CustomerServiceProxy,
    private _appSessionService: AppSessionService,
    private _router: Router,
    private _activityService: ActivityServiceProxy,
  ) {
    super(injector);
  }

  async ngOnInit() {
    if(this._appSessionService.userId && this._appSessionService.userId != null)
     this._router.navigate(['app/web-shop']);
    this.customer.isActive = true;
    // document.getElementById("toDate").toggleAttribute;
    // document.querySelector('#toDate').scrollIntoView();

    this.getAllBookingActivityTypes();
    this.setCustomerUserType();
    this.setCustomerNo();
   await this.loadEmployees();

  }

  startdateChangedHandler(startDate: Date) {
    console.log('parentttttttts start date',startDate);
    this.startDate = startDate;
  }

  private getAllBookingActivityTypes() {
    this._activityService.getAllBookingActivityTypes().subscribe((result) => {
      this.bookingActivityTypes = result.items;
      console.log('Booking Activity Types',this.bookingActivityTypes);
    });
  }

  private setCustomerNo() {
    this._customerService.getNextCustomerNo().subscribe((result) => {
      this.customer.customerNo = result.number + '';
    }
    );
  }

  setCustomerUserType() {
    this._userTypeService.getAll().subscribe((result) => {
      this.userTypes = result.items;
      var userType = this.userTypes.find(x => x.name === UserTypes.Customer);
      this.ifCustomerUserTypeFoundThenSetCustomerUserTypeValue(userType);
    }
    );
  }

  private ifCustomerUserTypeFoundThenSetCustomerUserTypeValue(userType: UserTypeDto) {
    if (userType) {
      this.customer.userTypeId = userType.id;
    }
  }

  // setInitialRolesStatus(): void {
  //   _map(this.roles, (item) => {
  //     this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
  //       item.normalizedName
  //     );
  //   });
  // }

  isRoleChecked(normalizedName: string): boolean {
    return this.defaultRoleCheckedStatus;
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  // getCheckedRoles(): string[] {
  //   const roles: string[] = [];
  //   _forEach(this.checkedRolesMap, function (value, key) {
  //     if (value) {
  //       roles.push(key);
  //     }
  //   });
  //   return roles;
  // }

  save(): void {
    this.saving = true;

    let bookingMinutes:number;
    if(this.createBooking.bookingActivityTypeId && this.createBooking.bookingActivityTypeId > 0)
    {
      bookingMinutes = this.bookingActivityTypes.find(x=>x.id == this.createBooking.bookingActivityTypeId).timeInMinutes;
    }
    else{
      this.notify.error(this.l('Please select booking type'));
      this.saving = false;
      return;
    }

    this.customer.roleNames = ['ADMIN'];
    this.customer.surname = this.customer.name;
    this.customer.townCity = this.customer.country;

    this._customerService.create(this.customer).subscribe(
      (customerUserId) => {

        this.saveBooking(customerUserId,bookingMinutes);
       // this.notify.info(this.l('SavedSuccessfully'));
        //this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }


  saveBooking(customerUserId,bookingMinutes){


    let year = this.startDate.getFullYear();
    let month = this.singleDigitToDouble( this.startDate.getMonth() + 1 );
    let day = this.singleDigitToDouble(this.startDate.getDate());
    let hours = this.singleDigitToDouble(this.startDate.getHours());
    let minutes =this.singleDigitToDouble( this.startDate.getMinutes());
    let seconds =this.singleDigitToDouble( this.startDate.getSeconds());

    let stringDate = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    this.createBooking.fromDate = stringDate;

   this.startDate.setMinutes(this.startDate.getMinutes()+bookingMinutes);

    day = this.singleDigitToDouble(this.startDate.getDate());
    hours = this.singleDigitToDouble(this.startDate.getHours());
    minutes =this.singleDigitToDouble( this.startDate.getMinutes());
    seconds =this.singleDigitToDouble( this.startDate.getSeconds());

    stringDate = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    this.createBooking.toDate = stringDate;
    console.log("create booking",this.createBooking);
    this.createBooking.customerUserId = customerUserId;

    this.bookingService.create(this.createBooking)
    .subscribe(
      () => {
        this.bsModalRef.hide();
        this.notify.info(this.l('SavedSuccessfully'));
        this._router.navigate(['main/thank-you']);
      },
      () => {
        this.saving = false;
      }
    );
  }

  singleDigitToDouble(val){
    if(val.toString().length == 1){
      return "0"+val.toString();
    }
    else{
      return val.toString();
    }
  }

  async loadEmployees() {
    this.employees=(await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
    console.log('thuis.employes', this.employees,this.employees.length);
    if(this.employees.length > 0)
    this.selectEmployee(this.employees[0],0,false);
  }

  selectEmployee(employee:UserDto,index,shouldSelectIndex:boolean){
    console.log('employeesdasewerwe', employee,index);
    if(shouldSelectIndex)
      this.selectedIndex = index;
    this.createBooking.employeeIds = [];
    this.createBooking.employeeIds.push(employee.id);
    this.customer.responsibleEmployeeId = employee.id;
  }

}

