import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '@service/request/request.service';
import { MatTableDataSource } from '@angular/material';
import { ConfigurationService } from '@service/configuration/configuration.service';

export interface SpringBootAdminInfo {
  url: string;
  status: string;
  statusColor: string;
  cluster: String;
  springBootAdminId: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  title = 'Neverpile';

  username = 'admin';
  password = 'admin';
  springBootAdminUrl: string;
  
  displayedColumns: string[] = ['name', 'cluster', 'status'];
  dataSource = new MatTableDataSource([]);

  constructor(private requestService: RequestService, private configurationService: ConfigurationService) {
    this.springBootAdminUrl = configurationService.getSpringBootAdminUrl();
  }

  ngOnInit() {
    const auth = 'Basic ' + window.btoa(this.username + ':' + this.password);
    const href = this.springBootAdminUrl + '/applications';

    this.requestService.request(href, 'application/json', 'json', auth).get<any>().subscribe(result => {
      result.forEach(application => {
      const regex: RegExp = /.*neverpile.*/;
        if (regex.test(application.name)) {
          application.instances.forEach(instance => {
            this.dataSource.data.push({
              url: instance.registration.serviceUrl,
              status: instance.statusInfo.status,
              statusColor: (['OFFLINE', 'DOWN', 'OUT_OF_SERVICE'].indexOf(instance.statusInfo.status) >= 0 ?
                '#F56A88' : instance.statusInfo.status === 'UP' ? '#7daf3b' : '#FFB892'),
              cluster: application.name,
              springBootAdminId: instance.id
            });
          });
        }
      });
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    }, error => {
      console.error(error);
      const result = [{ serviceUrl: 'ERROR', statusInfo: { status: 'ERROR' } }];
      result.forEach(element => {
        this.dataSource.data.push({
          url: element.serviceUrl,
          status: element.statusInfo.status,
          statusColor: 'red'
        });
      });
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    });
  }
}
