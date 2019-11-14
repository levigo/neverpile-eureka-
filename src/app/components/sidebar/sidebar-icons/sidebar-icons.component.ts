import { Component } from '@angular/core';
import { PageControlService } from '@service/menu/pages/page-control.service';

@Component({
  selector: 'app-sidebar-icons',
  templateUrl: './sidebar-icons.component.html',
  styleUrls: ['./sidebar-icons.component.scss']
})
export class SidebarIconsComponent {
  menu = [];
  selected: any;

  constructor(private pageControls: PageControlService) {
    this.menu = this.pageControls.getPageControls();
  }
  select(item) {
    this.selected = item;
  }
  isActive(item) {
    return this.selected === item;
  }
}
