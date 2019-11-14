import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageControlService {
  private menu = [
    {title: 'title-dashboard', link: '/', icon: 'fas fa-tachometer-alt'},
    {title: 'title-admin-section', link: '/system-settings', icon: 'fas fa-wrench'},
    {title: 'title-recherche', link: '/archive', icon: 'fas fa-database'},
    {title: 'title-api', link: '/api', icon: 'fas fa-book'},
  ];

  constructor() {}

  public getPageControls(): {title: string, link: string, icon: string}[] {
    return this.menu;
  }
}
