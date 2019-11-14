import { Component } from '@angular/core';
import { PageControlService } from '@service/menu/pages/page-control.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    menu = [];

  constructor(private pageControls: PageControlService) {
    this.menu = this.pageControls.getPageControls();
  }
}
