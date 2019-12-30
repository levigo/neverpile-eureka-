import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '@service/configuration/configuration.service';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {

  host = '';

  constructor(private configurationService: ConfigurationService) {
    this.host = configurationService.getNeverpileUrl();
  }

  ngOnInit() {
  }
}
