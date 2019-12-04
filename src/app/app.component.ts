import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { AuthenticationService } from '@service/authentication/auth.service';
import { MatSidenav } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { PageControlService } from '@service/menu/pages/page-control.service';
import { LanguageService } from '@service/menu/language/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('menu', {static: true}) menu: MatSidenav;
  @ViewChild('userMenuBtn', { read: ElementRef, static: false }) userMenuBtn: ElementRef;
  public userBtnTargetWidth: string;
  auth = false;
  sideNavOpened = false;
  currentUser = '';
  sectionTitle: string;
  pages = [];
  language = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private translate: TranslateService,
    private pageControls: PageControlService,
    private languageService: LanguageService,
  ) {
    this.pages = this.pageControls.getPageControls();
    this.language = this.languageService.getLanguages();

    const language = localStorage.getItem('language');
    this.translate.setDefaultLang(language);
    this.translate.use(language);

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setSectionTitle(event.url);
      }
    });
    this.setSectionTitle(router.url);
  }

  setSectionTitle(url: any) {
    this.pages.forEach(element => {
      if (url === element.link) {
        this.sectionTitle = element.title;
      }
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
    /*     if (this.authService.isAuthenticated()) {
          this.initCurrentUser();
        } */
    this.authService.authenticationStateChanged().subscribe(authenticated => {
      this.auth = authenticated;

      if (authenticated) {
        this.initCurrentUser();
      } else {
        this.currentUser = '';
      }
    });
  }
  ngAfterViewInit() {
    this.adjustCdkColumn();
  }

  initCurrentUser(): void {
    /*     TODO
         ...getCurrentUser().subscribe(user => {
           let userName = [user.firstName, user.surname];
           this.currentUser = userName.join(' ');
         });  */
    this.currentUser = 'Max Mustermann';
  }

  // TODO - nur zu Testzwecken
  login(): void {
    this.authService.login();
  }

  // TODO - nur zu Testzwecken

  logout(): void {
    this.authService.logout();
    if (this.menu.opened) {
      this.toggleSideNav();
    }
  }

  public onMenubuttonClicked(): void {
    if (!this.auth) {
      // this.authService.showLoginForm();
    } else {
      this.toggleSideNav();
    }
  }

  toggleSideNav(event?: MouseEvent): void {
    if (event) {
      if (event.toElement) {
        if (!event.toElement.classList.contains('mat-drawer-backdrop')) {
          return; // only toggle when exit on backdrop
        }
      } else {
        return; // invalit mouseleave target
      }
    }
    this.menu.toggle();
  }

  private adjustCdkColumn() {
    let targetWidth = parseInt(window.getComputedStyle(this.userMenuBtn.nativeElement, null).getPropertyValue("width"), 10);

    /* 
    The following section adds a style entry to the document header for the class "cdk-overlay-container". 
    This ensures that the minimum length of the user menu corresponds to the user menu button. 
     */
    let head = document.getElementsByTagName("head")[0];
    let style = document.createElement("style");
    style.innerText = "button.userButton.menuOption { min-width: " + targetWidth + "px;}";
    head.appendChild(style);
  }
}
