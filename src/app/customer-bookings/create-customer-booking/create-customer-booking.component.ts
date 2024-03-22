import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Component, Injector, OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/app-component-base";
import { UserTypes } from "@shared/AppConsts";
import { DateHelper } from "@shared/helpers/DateHelper";
import {
  ActivityServiceProxy,
  BookingActivityTypeDto,
  BookingServiceProxy,
  CreateBookingDto,
  UserDto,
  UserServiceProxy,
  UserTypeDto,
  UserTypeServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-create-customer-booking",
  templateUrl: "./create-customer-booking.component.html",
  styleUrls: ["./create-customer-booking.component.css"],
  animations: [appModuleAnimation()],
})
export class CreateCustomerBookingComponent
  extends AppComponentBase
  implements OnInit
{
  saving = false;
  createBooking = new CreateBookingDto();
  userTypes: UserTypeDto[] = [];
  employees: UserDto[] = [];
  imgNotFoundUrl: string = "../assets/img/image-not-found.png";
  selectedIndex?: number | undefined;
  customerId: number;
  bookingActivityTypes: BookingActivityTypeDto[] = [];
  startDate: Date;
  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private bookingService: BookingServiceProxy,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    private _datePipe: DatePipe,
    private router: Router,
    private _activityService: ActivityServiceProxy
  ) {
    super(injector);
    this.createBooking.employeeIds = [];
  }

  async ngOnInit(): Promise<void> {
    this.getAllBookingActivityTypes();
    await this.loadEmployees();
  }

  startdateChangedHandler(startDate: Date) {
    console.log("parentttttttts start date", startDate);
    this.startDate = startDate;
  }

  private getAllBookingActivityTypes() {
    this._activityService.getAllBookingActivityTypes().subscribe((result) => {
      this.bookingActivityTypes = result.items;
    });
  }

  save() {
    let bookingMinutes: number;
    if (
      this.createBooking.bookingActivityTypeId &&
      this.createBooking.bookingActivityTypeId > 0
    ) {
      bookingMinutes = this.bookingActivityTypes.find(
        (x) => x.id == this.createBooking.bookingActivityTypeId
      ).timeInMinutes;
    } else {
      this.notify.error(this.l("Please select booking type"));
      return;
    }

    let year = this.startDate.getFullYear();
    let month = this.singleDigitToDouble(this.startDate.getMonth() + 1);
    let day = this.singleDigitToDouble(this.startDate.getDate());
    let hours = this.singleDigitToDouble(this.startDate.getHours());
    let minutes = this.singleDigitToDouble(this.startDate.getMinutes());
    let seconds = this.singleDigitToDouble(this.startDate.getSeconds());

    let stringDate =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    this.createBooking.fromDate = stringDate;

    this.startDate.setMinutes(this.startDate.getMinutes() + bookingMinutes);

    day = this.singleDigitToDouble(this.startDate.getDate());
    hours = this.singleDigitToDouble(this.startDate.getHours());
    minutes = this.singleDigitToDouble(this.startDate.getMinutes());
    seconds = this.singleDigitToDouble(this.startDate.getSeconds());

    stringDate =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    this.createBooking.toDate = stringDate;
    this.createBooking.customerUserId = this.appSession.userId;
    console.log("create booking", this.createBooking);

    this.bookingService.create(this.createBooking).subscribe(
      () => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.router.navigate(["app/bookings"]);
      },
      () => {
        this.saving = false;
      }
    );
  }

  singleDigitToDouble(val) {
    if (val.toString().length == 1) {
      return "0" + val.toString();
    } else {
      return val.toString();
    }
  }

  async loadEmployees() {
    this.employees = (
      await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()
    ).items;
    if (this.employees.length > 0) this.selectEmployee(this.employees[0].id);
  }

  selectEmployee(employeeId: number) {
    if (this.createBooking.employeeIds.includes(employeeId)) {
      this.createBooking.employeeIds.splice(
        this.createBooking.employeeIds.lastIndexOf(employeeId)
      );
    } else {
      this.createBooking.employeeIds.push(employeeId);
    }
  }
}
