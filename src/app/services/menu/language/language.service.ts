import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
    private menu = [
      {title: 'Englisch', lang:'en', image: '/assets/images/united-kingdom.png'},
      {title: 'Deutsch', lang:'de', image: "/assets/images/germany.png"}
    ];

  constructor() { }

  public getLanguages(): {title: string, lang: string, image: string}[] {
    return this.menu;
  }
}
