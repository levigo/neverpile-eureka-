import { Component, Inject } from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-document-upload-dialog',
  templateUrl: 'document-upload-dialog.component.html',
})
export class DocumentUploadDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DocumentUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  selectedFiles: File[];
  documentID: string;

  changedFiles(files: File[]) {
    this.selectedFiles = files;
  }

  submit(form) {
    this.dialogRef.close({
      'documentId': this.documentID,
      'content': this.selectedFiles
    });
  }

}
