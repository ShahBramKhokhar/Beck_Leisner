import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { FaultStatuses, inviteReponse } from '@shared/AppConsts';
import { InviteDto, UserLoginInfoDto, ActivityDto, CustomerResponseDto, CommentDto, CreateCommentDto, AssignToUserInputDto, ActivityTaskDto, BookingDto, InviteServiceProxy, ActivityServiceProxy, CommentServiceProxy, ActivityTaskServiceProxy, BookingServiceProxy, UpdateBookingEmployeeStatusInputDto, FaultServiceProxy, FaultDto, UpdateFaultStatusDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { AbpSessionService } from 'abp-ng2-module';

@Component({
  selector: 'app-fault-detail',
  templateUrl: './fault-detail.component.html',
  styleUrls: ['./fault-detail.component.css']
})
export class FaultDetailComponent extends AppComponentBase implements OnInit {

  faultId: number;
  inviteInfo: InviteDto = new InviteDto();
  activityDto : ActivityDto = new ActivityDto();
  customersReponses: CustomerResponseDto[] = [];
  activityTypes: any;
  comments: CommentDto[];
  commentDto = new CreateCommentDto();
  userId: number;
  faultDto = new FaultDto();


  constructor(
    public injector: Injector,
    private route: ActivatedRoute,
    private _activityService: ActivityServiceProxy,
    private _sessionService: AbpSessionService,
    private _appSessionService: AppSessionService,
    private _commentService: CommentServiceProxy,
    private _faultService: FaultServiceProxy
  ) {
    super(injector);

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      this.userId = this._sessionService.userId//Number.parseInt(params['userId']);
      this.faultId = Number.parseInt(params['faultId']);
      this.getFaultDetail();
      if (this.userId > 0 && this.faultId > 0) {
       this.getComments();
      }

    });
  }
  getActivityTypeName(id: number) {
    if (this.activityTypes) {
      for (let i = 0; i < this.activityTypes.length; i++) {
        if (this.activityTypes[i].id == id)
          return this.activityTypes[i].name;
      }
    }
    return "";
  }
  addComment() {
    this.commentDto.commentText = this.commentDto.commentText;
    this.commentDto.activityId = this.faultDto.activityId;
    this._commentService.create(this.commentDto).subscribe((result) => {
      this.notify.info(this.l('SavedSuccessfully'));
      this.commentDto = new CreateCommentDto();
      this.getComments();
    });
  }

  getComments() {
    this._commentService.getAll(this.faultDto.activityId).subscribe((result) => {
      this.comments = result.items;
      console.log('this.comments', this.comments,result.items)
    });
  }

  getFaultDetail() {
    this._faultService.getById(this.faultId).subscribe((result) => {
      this.faultDto = result;
      this.getComments();
    });
  }

isAdminUser(): boolean {

 return this._appSessionService.isAdminUser();
}

isFaultResolved(){
  return this.faultDto.status ==='Resolved';
}

}

