import { Component, Output, EventEmitter } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

export class PeriodicElement {


  constructor(name: string, size: number, type: string, file: File) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.file = file;
  }

  name: string;
  size: number;
  type: string;
  file: File;
}

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropContentUploadComponent {
  @Output() changedFiles = new EventEmitter<File[]>();

  constructor() {
    this.selectionChanged.subscribe(() => {
      const selectedFiles: File[] = [];
      this.selection.selected.forEach(item => {
        selectedFiles.push(item.file);
      });
      this.changedFiles.emit(selectedFiles);
    });
  }

  private tableData: PeriodicElement[] = [];
  displayedColumns: string[] = ['select', 'name', 'size', 'type'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.tableData);
  selection = new SelectionModel<PeriodicElement>(true, []);
  selectionChanged: any = this.selection.changed;
  fileInputValue = '';


  public dropped(files: NgxFileDropEntry[]) {

    let fileEntry;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.addFile(file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  addFile(file: File) {
    const newRow = new PeriodicElement(file.name, file.size, file.type, file);
    if (this.selection.selected.indexOf(newRow) < 0) {
      this.tableData.push(newRow);
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.tableData);
      this.selection.select(newRow);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeSelected() {
    this.selection.selected.forEach(item => {
      const index: number = this.tableData.findIndex(d => d === item);
      this.tableData.splice(index, 1);
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.tableData);
    this.selection.clear();
  }

  onFileChanged(event) {
    //  Select new file.
    if (event.target.files.length <= 0 && typeof event.target.files[0].name !== undefined) {
      return;
    }
    for (let i = 0; i < event.target.files.length; i++) {
      this.fileInputValue = null;
      this.addFile(event.target.files[i]);
    }
  }

  reset() {
    this.dataSource.data.forEach(row => this.selection.select(row));
    this.selection.selected.forEach(item => {
      const index: number = this.tableData.findIndex(d => d === item);
      this.tableData.splice(index, 1);
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.tableData);
    this.selection.clear();
  }
}
