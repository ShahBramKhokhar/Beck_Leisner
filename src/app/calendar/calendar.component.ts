import { ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts'
import {
  ActivityListDto,
  ActivityServiceProxy,
} from './../../shared/service-proxies/service-proxies'
import { DateHelper } from './../../shared/helpers/DateHelper'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { CalendarEvent, CalendarView } from 'angular-calendar'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { CreateInvitedActivityComponent } from '@app/invited-activities/create-invited-activity/create-invited-activity.component'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @Input('roomId') roomId:number;
  @Output() dateChanged: EventEmitter<Date> =   new EventEmitter();
   view: CalendarView = CalendarView.Week
  CalendarView = CalendarView
  viewDate: Date = new Date();
  startDate: Date;
  activities: ActivityListDto[] = []
  events: CalendarEvent[] = []
  activeDayIsOpen: boolean = true
  daysInWeek: number
  calendarEventstartsAt:any;
  calendarEventendsAt:any;
  oldCalenderEvent: CalendarEvent|null;
  calendarColor = '#595757';

  constructor(
    private _activityService: ActivityServiceProxy,
    private _modalService: BsModalService,
    private _datePipeService: DatePipe
  ) {

    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var firstday = new Date(curr.setDate(first));
    this.startDate = new Date(firstday.setHours(0,0,0,0));
    // this.startDate=new Date(
    //   this._datePipeService.transform(
    //     DateHelper.toLocalDate(new Date(curr.setDate(first))),
    //   ),
    // );
  }

  async ngOnInit() {

    await this.getActivities()

    console.log(this.activities)
  }

  private async getActivities() {
    console.log(this.roomId);

    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view]

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view]

    let fromDate = new Date(
      format(getStart(this.viewDate), AppConsts.dateFormate),
    )
    let toDate = new Date(format(getEnd(this.viewDate), AppConsts.dateFormate))

    // this.activities = await (
    //   await this._activityService
    //     .getAllActivities(
    //       DateHelper.convertDateTimeToString(fromDate, AppConsts.dateFormate),
    //       DateHelper.convertDateTimeToString(toDate, AppConsts.dateFormate),
    //       this.roomId
    //     )
    //     .toPromise()
    // ).items
    this.events = this.convertEventsToCalenderEvents(this.activities)
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("dayClicked", date, events );
}

  convertEventsToCalenderEvents(
    activities: ActivityListDto[],
  ): CalendarEvent[] {
    var calendarEvents: CalendarEvent[] = []

    // activities.forEach((activity) => {
    //   let startDate=new Date(
    //     this._datePipeService.transform(
    //       DateHelper.toLocalDate(activity.date),
    //     ),
    //   );
    //   //Deep copy startDate
    //   let endDate = new Date(startDate.getTime())
    //   endDate.setHours(5);
    //   calendarEvents.push({
    //     start:startDate ,
    //     end:endDate,
    //     title:
    //       "<div class='cal-event-title2'><h6 class='text-large alert- heading text-center   text-wrap'   >" +
    //       activity.name +
    //       '</h6><span ><b>Type:</b> ' +
    //       activity.activityTypeName +
    //       '</span></div>',
    //     color: {
    //       primary: '#ad2121',
    //       secondary: '#007bff',
    //     },
    //     // actions: this.actions,
    //     allDay: false,
    //     resizable: {
    //       beforeStart: true,
    //       afterEnd: true,
    //     },
    //     draggable: false,
    //     id: activity.id,
    //     cssClass: 'cal-event-title',
    //   })
    // });

    var eventsStartDate = new Date(this.startDate);
    eventsStartDate = new Date(eventsStartDate.setMinutes(eventsStartDate.getMinutes() -30));


    for (let i = 1; i <= 335; i++) {

      let endDate = new Date(eventsStartDate);
      endDate = new Date(endDate.setMinutes(endDate.getMinutes()+30))
      calendarEvents.push({
        start:eventsStartDate ,
        end:endDate,
        title:
          this.calendarTitle(endDate),
        color: {
          primary: this.calendarColor,
          secondary: this.calendarColor,
        },
        // actions: this.actions,
        allDay: false,
        resizable: {
          beforeStart: false,
          afterEnd: false,
        },
        draggable: false,
        id: i,
        // cssClass: 'calClass',
      });

      eventsStartDate = new Date(eventsStartDate.setMinutes(eventsStartDate.getMinutes()+30));

    }

    return calendarEvents;
  }

  private calendarTitle(endDate: Date): string {
    return "<div >" +
      "<span style=' text-align: center;' ><b >" + this.singleDigitToDouble(endDate.getHours()) + ":" +
      this.singleDigitToDouble(endDate.getMinutes()) + "</b>" +
      '</span></div>';
  }

  singleDigitToDouble(val){
    if(val.toString().length == 1){
      return "0"+val.toString();
    }
    else{
      return val.toString();
    }
  }

  getLocalDate(date: Date) {
    var date = new Date(date)
    return date.toDateString()
  }

  async changeDate(): Promise<void> {

   this.startDate = new Date(this.startDate.setDate(this.startDate.getDate() - 7));
   await this.getActivities();
  }
  async addDate(){

    this.startDate = new Date(this.startDate.setDate(this.startDate.getDate() + 7));

   await this.getActivities();
  }
  async setView(view: CalendarView): Promise<void> {
    this.view = view
    this.getActivities()
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false
  }

  async handleEvent(action: string, event: CalendarEvent): Promise<void> {
    try {


      if(this.oldCalenderEvent && this.oldCalenderEvent !== null)
      {
        this.oldCalenderEvent.color = {
          primary: this.calendarColor,
          secondary: this.calendarColor,
        },
        this.events[this.oldCalenderEvent.id] = this.oldCalenderEvent;
      }
      this.oldCalenderEvent = event;

      event.title =   this.calendarTitle(event.start);
      event.color = {
        primary: 'green',
        secondary: 'green',
      },
      this.events[event.id] = event;


      this.dateChanged.emit(event.end);

      //this.showCreateOrEditActivityDialog(Number(event.id))
    } catch (error) {
      console.log(error)
    }
  }

  timeSpanEvent(event: CalendarEvent){
    try {
      console.log('event',event);
      //this.showCreateOrEditActivityDialog(Number(event.id))
    } catch (error) {
      console.log(error)
    }
  }

  private showCreateOrEditActivityDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateInvitedActivityComponent,
        {
          class: 'modal-lg',
        },
      )
    } else {
      createOrEditUserDialog = this._modalService.show(
        CreateInvitedActivityComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        },
      )
    }
  }
}
