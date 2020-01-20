import { Component, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatSnackBar, MatDialog, MatCheckboxChange } from '@angular/material';
import { of } from 'rxjs';

import { ConfigurationService } from '@service/configuration/configuration.service';
import { ContentUploadDialogComponent } from '@component/upload-file/content-upload/content-upload-dialog.component';
import { ConfirmDialogComponent } from '@component/confirm-dialog/confirm-dialog.component';
import { JwtComponent } from '@component/jwt/jwt.component'
import { RequestService } from '@service/request/request.service';

interface NodeData {
  name: string;
  documentId: string;
  elementId: string;
  type: 'document' | 'audit' | 'metadata' | 'content' | 'collection' | 'addContent';
  children: NodeData[];
}

interface ContentNode extends NodeData {
  contentType: string;
  fileName: string;
}

const GetChildren = (node: NodeData) => of(node.children);

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {
  
  selectionHeader: string;
  previewContent = '';
  selectedDocumentId = '';
  neverpileHostURL = '';
  searchQuery;
  treeControl = new NestedTreeControl(GetChildren);
  loading = false;
  showDownloadBtn = false;
  showJWT = false;
  @ViewChild('downloadFileBtn', { static: true }) downloadFileBtn;
  @ViewChild('jwt', { static: true }) jwt: JwtComponent;

  selectedContentElements = [];

  constructor(private requestService: RequestService, private configurationService: ConfigurationService, 
    public dialog: MatDialog, public snackBar: MatSnackBar) { 
      this.neverpileHostURL = configurationService.getNeverpileUrl();
    }

  data = [];
  hasChild(_: number, node: NodeData) {
    return node.children != null && node.children.length > 0;
  }

  selectNode(node: NodeData) {
    this.selectionHeader = node.name;
    this.previewContent = ' ';

    switch (node.type) {
      case 'document':
        this.getContent('', 'document.json');
        break;
      case 'audit':
        this.getContent('/audit', 'audit.log');
        break;
      case 'metadata':
        this.getContent('/metadata', 'metadata.json');
        break;
      case 'content':
        this.getContent('/content/' + node.elementId, (<ContentNode>node).fileName);
        break;
      case 'collection':
        this.selectionHeader = 'NeverPile Collection: ' + node.name;

      default:
      // nothing to do
    }
  }

  openAddContentDialog() {
    const dialogRef = this.dialog.open(ContentUploadDialogComponent, {
      data: { titel: 'dialog-new-content' },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(files => {
      if (files) {
        this.addContent(files);
      }
    });
  }

  openDeleteDocumentDialog(node: NodeData) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { confirmText: 'dialog-confirm-delete-document-text' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDocument(node);
      }
    });
  }

  deleteDocument(node: NodeData) {
    const href = this.neverpileHostURL + '/api/v1/documents/' + node.documentId;

    this.requestService.request(href).delete().subscribe(() => {
      this.previewContent = '';
      this.snackBar.open('Document successfully deleted!', 'close', {
        duration: 1000,
      });

      this.data = [];
      this.treeControl.dataNodes = this.data;
    }, error => {
      this.snackBar.open('Failed to delete document!', 'close', {
        duration: 1000,
      });
      console.error(error);
    });
  }

  deleteContent(elementIds: string[]) {
    if (elementIds.length === 0) {
      this.snackBar.open('Content successfully deleted!', 'close', {
        duration: 1000,
      });
      return;
    }
    const elementId = elementIds.pop();
    const href = this.neverpileHostURL + '/api/v1/documents/' + this.selectedDocumentId + '/content/' + elementId;

    this.requestService.request(href).delete().subscribe(() => {
      this.previewContent = '';
      this.searchDocument(this.searchQuery);
      this.deleteContent(elementIds);
    }, error => {
      this.snackBar.open('Failed to delete content!', 'close', {
        duration: 1000,
      });
      console.error(error);
    });
  }

  addContent(files) {
    const href = this.neverpileHostURL + '/api/v1/documents/' + this.selectedDocumentId + '/content';
    this.loading = true;
    this.previewContent = ' ';

    this.requestService.uploadContent(href, files).subscribe(result => {
      if (result.type === 0) {
        return;
      }
      this.previewContent = JSON.stringify(result, null, 4);
      this.searchDocument(this.selectedDocumentId);
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  getContent(typ: string, fileName: string) {
    let href = this.neverpileHostURL + '/api/v1/documents/' + this.selectedDocumentId + typ;
    this.loading = true;
    this.showJWT = false;

    if (this.jwt.isJWTAvailable() && fileName.endsWith('.pdf')) {
      href += "?X-NPE-PSU-Duration=PT24H";
      this.requestService.request(href, 'application/json', 'text').get<any>().subscribe(result => {
        this.previewContent = fileName;
        this.showJWT = true;
        this.showDownloadBtn = false;
        this.loading = false;
        setTimeout(() => {
          this.jwt.displayDocument(result);
        }, 100);
      }, error => {
        console.error(error);
        this.loading = false;
      });
      return;
    }

    this.requestService.request(href, 'application/json', 'blob').get<any>().subscribe(result => {
      if (!this.fileTypeIsReadable(fileName) || result.size > 1000000) {
        this.downloadFileBtn.nativeElement.setAttribute('href', window.URL.createObjectURL(result));
        this.downloadFileBtn.nativeElement.setAttribute('download', fileName);
        this.previewContent = fileName;
        this.showDownloadBtn = true;
      } else {
        let text = this.blobToString(result);
        if (result.type === 'application/json') {
          text = JSON.stringify(JSON.parse(text), null, 4); // to restore fromatting with linebreaks.
        }
        this.previewContent = text;
        this.showDownloadBtn = false;
      }
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  blobToString(b) {
    let u, x;
    u = URL.createObjectURL(b);
    x = new XMLHttpRequest();
    x.open('GET', u, false);
    x.send();
    URL.revokeObjectURL(u);
    return x.responseText;
  }

  searchDocument(searchQuery) {
    this.getDocument(searchQuery);
  }

  getDocument(searchQuery) {
    if (searchQuery === undefined) {
      searchQuery = this.selectedDocumentId;
    }
    const href = this.neverpileHostURL + '/api/v1/documents/' + searchQuery +
      '?facets=contentElements,documentId,audit,metadata,dateCreated,dateModified';

    this.requestService.request(href).get<any>().subscribe(result => {
      if (result.documentId !== undefined) {
        this.selectedDocumentId = result.documentId;
      }

      this.data = [
        {
          name: 'keywords-collection',
          typ: 'collection',
          children: [this.parseDocumentNodes(result)]
        }
      ];
      this.treeControl.dataNodes = this.data;
      this.treeControl.expandAll();

    }, error => {
      console.error(error);
    });
  }

  parseDocumentNodes(result: any) {
    const newDocNode: NodeData = {
      name: 'keywords-document',
      documentId: result.documentId,
      type: 'document',
      elementId: result.documentId,
      children: []
    };

    if (result.audit) {
      const audit: NodeData = {
        name: 'keywords-auditlog',
        type: 'audit',
        documentId: result.documentId,
        elementId: '0',
        children: []
      };
      newDocNode.children.push(audit);
    }

    if (result.metadata) {
      const metadata: NodeData = {
        name: 'keywords-metadata',
        type: 'metadata',
        documentId: result.documentId,
        elementId: '0',
        children: []
      };
      newDocNode.children.push(metadata);
    }

    if (result.contentElements) {
      result.contentElements.forEach(element => {
        const contentElement: ContentNode = {
          name: 'dialog-content',
          type: 'content',
          documentId: result.documentId,
          elementId: element.id,
          contentType: element.type,
          fileName: element.fileName,
          children: []
        };
        newDocNode.children.push(contentElement);
      });
    }

    // Add/Delete Content Button
    newDocNode.children.push({
      name: 'add-content',
      type: 'addContent',
      documentId: result.documentId,
      elementId: '0',
      children: []
    });
    return newDocNode
  }

  contetntSelected(elementId, event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedContentElements.push(elementId);
    } else {
      const index = this.selectedContentElements.indexOf(elementId, 0);
      if (index > -1) {
        this.selectedContentElements.splice(index, 1);
      }
    }
  }

  addOrRemoveContent() {
    if (this.selectedContentElements.length === 0) {
      this.openAddContentDialog();
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { confirmText: 'dialog-confirm-delete-content-text' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteContent(this.selectedContentElements);
          this.selectedContentElements = [];
        }
      });
    }
  }

  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  fileTypeIsReadable(fileName: string): boolean {
    return fileName.endsWith('.txt') ||
      fileName.endsWith('.log') ||
      fileName.endsWith('.json') ||
      fileName.endsWith('.js') ||
      fileName.endsWith('.php') ||
      fileName.endsWith('.java') ||
      fileName.endsWith('.ts') ||
      fileName.endsWith('.css') ||
      fileName.endsWith('.html') ||
      fileName.endsWith('.scss') ||
      fileName.endsWith('.bat') ||
      fileName.endsWith('.sh') ||
      fileName.endsWith('.xml') ||
      fileName.endsWith('.json')
      ;
  }
}
