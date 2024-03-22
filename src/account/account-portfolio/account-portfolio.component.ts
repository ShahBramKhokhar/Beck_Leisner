import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-account-portfolio',
  templateUrl: './account-portfolio.component.html',
  styleUrls: ['./account-portfolio.component.css']
})
export class AccountPortfolioComponent implements OnInit {

  
  @ViewChild('lgModal', { static: false }) childModal?: ModalDirective;
  popSrc: any;
  constructor() { 
    
        }

  ngOnInit(): void {
  }

  showChildModal(src): void {

     this.popSrc =src;
    this.childModal?.show();
  }
 
  hideChildModal(): void {
    this.childModal?.hide();
  }

}
