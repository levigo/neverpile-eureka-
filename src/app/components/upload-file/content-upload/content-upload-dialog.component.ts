import { Component, Inject } from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-content-upload-dialog',
  templateUrl: './content-upload-dialog.component.html',
  styleUrls: ['./content-upload-dialog.component.scss']
})
export class ContentUploadDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ContentUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  selectedFiles: File[] = [];

  changedFiles(files: File[]) {
    this.selectedFiles = files;
  }

  submit(form) {
    this.dialogRef.close(this.selectedFiles);
  }

}
