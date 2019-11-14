import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
import { RequestService, DocumentDto } from '@service/request/request.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent {
  private neverpileHostURL: string = environment.neverpileUrl;
  public previewContent = '';
  selectedFiles: File[] = [];
  documentId: string;
  loading = false;
  editorOptions: JsonEditorOptions;
  documentInfo: DocumentDto;

  @Output() newDocumentId = new EventEmitter<string>();
  @ViewChild('dragAndDrop', {static: true}) dragAndDrop;
  @ViewChild('documentDtoEditor', {static: true}) editor: JsonEditorComponent;

  constructor(private requestService: RequestService, public snackBar: MatSnackBar) { 
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'tree'];
    this.editorOptions.mode = 'code';
    this.editorOptions.onChange = this.onJsonChange.bind(this);
  }

  onFileChanged(files: File[]) {
    this.selectedFiles = files;
  }

  addDocument() {
    const href = this.neverpileHostURL + '/api/v1/documents/';
    this.loading = true;
    this.requestService.uploadDocument(href, {documentId: this.documentId, ...this.documentInfo}, this.selectedFiles).subscribe(result => {
      if (result.body === undefined) {
        return;
      }
      this.snackBar.open('Document successfully created!', 'close', {
        duration: 1000,
      });
      // reset
      this.dragAndDrop.reset();
      this.documentId = '';
      this.loading = false;
      // redirect
      this.newDocumentId.emit(result.body.documentId);
    }, error => {
      this.snackBar.open('Failed to create document!', 'close', {
        duration: 1000,
      });
      this.loading = false;
      console.error(error);
    });
  }

  onJsonChange(): any {
    try {
      this.documentInfo = this.editor.get() as any as DocumentDto;
    } catch(error) {
      // ignore
    }
  }
}
