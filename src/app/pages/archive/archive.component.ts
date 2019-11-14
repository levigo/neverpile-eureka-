import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})

export class ArchiveComponent {

  selectdeTab = 0;

  @ViewChild('searchComponent', {static: true}) searchComponent;

  constructor() { }

  onNewDocumentIdCreated(id) {
    this.searchComponent.searchDocument(id);
    this.selectdeTab = 0;
  }

}
