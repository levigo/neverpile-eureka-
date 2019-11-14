import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.scss']
})
export class GooglemapComponent implements OnInit {

  lat = 48.6505397;
  lng = 9.009946;
  zoom = 12;
  style = [
    { hue: '#004f9e' },
    { saturation: -40 },
    { lightness: 20 },
    { gamma: 0.8 }
  ];
  styles = [
    { featureType: 'landscape', stylers: this.style },
    { featureType: 'road.highway', stylers: this.style },
    { featureType: 'road.arterial', stylers: this.style },
    { featureType: 'road.local', stylers: this.style },
    { featureType: 'water', stylers: this.style },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] }
  ];


  constructor() { }

  ngOnInit() {
  }

}
