import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '@component/confirm-dialog/confirm-dialog.component';
import { environment } from '@environments/environment';
import { RequestService } from '@service/request/request.service';

@Component({
  selector: 'app-index-maintenance',
  templateUrl: './index-maintenance.component.html',
  styleUrls: ['./index-maintenance.component.scss']
})
export class IndexMaintenanceComponent implements OnInit {
  neverpileHostURL: string = environment.neverpileUrl;

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private requestService: RequestService) { }

  ngOnInit() { }

  reset() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {confirmText: 'dialog-confirm-reset-index-text'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const href = this.neverpileHostURL + '/api/v1/index/hard-reset';

        this.requestService.request(href).post('').subscribe(() => {
          this.snackBar.open('Reset job started!', 'close', {
            duration: 1000,
          });
        }, error => {
          this.snackBar.open('Unable to start job!', 'close', {
            duration: 1000,
          });
        });
      }
    });
  }

  rebuild() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {confirmText: 'dialog-confirm-rebuild-index-text'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const href = this.neverpileHostURL + '/api/v1/index/rebuild';

        this.requestService.request(href).post('').subscribe(() => {
          this.snackBar.open('Rebuild job started!', 'close', {
            duration: 1000,
          });
        }, error => {
          this.snackBar.open('Unable to start job!', 'close', {
            duration: 1000
          });
        });
      }
    });
  }
}
