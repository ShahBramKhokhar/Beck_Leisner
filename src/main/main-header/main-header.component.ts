import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  CompanyLoginInfoDto,
  MenuItemDto,
  MenuItemServiceProxy,
  OrderDto,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";

@Component({
  selector: "app-main-header",
  templateUrl: "./main-header.component.html",

  styleUrls: ["./main-header.component.css"],
  animations: [appModuleAnimation()],
})
export class MainHeaderComponent implements OnInit {
  // navLinks = ['Home', 'About', 'Contact'];
  x = "cover";
  menusItem: MenuItemDto[] = [];
  companyInfo = new CompanyLoginInfoDto();
  muted = true;
  constructor(
    private appSessionService: AppSessionService,
    private router: Router,
    private menuService: MenuItemServiceProxy
  ) {}

  @ViewChild("nav")
  elementRef!: ElementRef;
  ngOnInit() {
    this.companyInfo = this.appSessionService.company;
    let menuItem= 
    this.menusItem.push(this.getMenueItem('Forside','/main',1));
    this.menusItem.push(this.getMenueItem('Om','/main/about',7));
    this.menusItem.push(this.getMenueItem('Kontakt','/main/contact',4));
    this.menusItem.push(this.getMenueItem('Medarbejdere','/main/team',3));
    this.menusItem.push(this.getMenueItem('Portfolio','/main/portfolio',2,false));
    this.menusItem.push(this.getMenueItem('Shop','/main/products',6));
    this.menusItem.push(this.getMenueItem('Booking','/main/add-booking',5));
    this.menusItem.push(this.getMenueItem('Login','/main/login',8));
    
      this.menusItem = this.menusItem.sort((a, b) => {
        return a.orderNo - b.orderNo;
      });

      console.log(this.menusItem);
    // this.menuService.get().subscribe((res) => {

    //   var navs = res.filter(a=>a.isActive);
    //   this.menusItem = navs.sort((a, b) => {
    //     return a.orderNo - b.orderNo;
    //   });

    //   console.log(this.menusItem);
    // });
  }
  getMenueItem(name: string, link: string, order: number,isActive=true) {
    let menueItem=new MenuItemDto();
    menueItem.name=name;
    menueItem.routerLink=link;
    menueItem.orderNo=order;
    menueItem.isActive=isActive;
    return menueItem;
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(event: Event) {
    const number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    event.preventDefault();
    if (number > 60) {
      this.elementRef.nativeElement.style.setProperty(
        "background-color",
        "#9fa38f "
      );
      console.log(this.elementRef);
    } else {
      this.elementRef.nativeElement.style.setProperty(
        "background-color",
        "transparent"
      );
    }
  }

  createBooking() {
    this.router.navigate(["main/add-booking"]);
  }

  goToLogin() {
    this.router.navigate(["main/login"]);
  }

  goToWebShop() {
    this.router.navigate(["main/products"]);
  }
}
