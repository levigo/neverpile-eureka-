import { Component } from '@angular/core';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-jwt',
  templateUrl: './jwt.component.html',
  styleUrls: ['./jwt.component.scss']
})
export class JwtComponent {
  constructor() { 
    this.loadJWT();
  }

  displayDocument(url){
    if(this.isJWTAvailable()){
      window["getJadiceApi"]().loadDocument(url);
    }
  }
  
  isJWTAvailable(){
    return Object.prototype.hasOwnProperty.call(window, "getJadiceApi");
  }

  loadJWT() {
    const scriptTag = document.createElement('script');
    scriptTag.src = environment.jwtUrl + "/imageviewer/imageviewer.nocache.js"
    scriptTag.type = 'text/javascript';
    scriptTag.async = false;
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
  }
}
