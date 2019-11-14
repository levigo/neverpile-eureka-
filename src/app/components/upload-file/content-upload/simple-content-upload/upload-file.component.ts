import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  // Upload file properties.
  @Output() changedFiles = new EventEmitter<File[]>();
  selectedFiles: File[];
  fileName: string;

  constructor() { }

  ngOnInit() {}

  onFileChanged(event) {
    // Select new file.
    if (event.target.files.length <= 0 && typeof event.target.files[0].name !== undefined) {
      return;
    }
     this.fileName = event.target.files[0].name;
    if (this.fileName === '') {
      return;
    }
    this.selectedFiles = event.target.files;
    this.changedFiles.emit(this.selectedFiles);
  }

  onClear() {
    this.fileName = '';
    this.changedFiles.emit([]);
  }

}
