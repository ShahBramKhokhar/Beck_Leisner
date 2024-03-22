import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css'],
  animations: [appModuleAnimation()],
})
export class MainFooterComponent implements OnInit {
  visibleDivs: string[] = ['div11'];
  constructor() { }

  ngOnInit(): void {
  }

}
