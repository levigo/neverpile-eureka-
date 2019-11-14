import { Component, OnInit, AfterViewChecked, ViewChildren, QueryList, Directive, ChangeDetectorRef, HostListener, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap, debounce, debounceTime, mergeMap, tap, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { AccessPolicyService, AccessPolicy, AccessRule, Effect, ValidationResult, Type } from '../access-policy-service.service';
import { Observable, Subject, timer } from 'rxjs';
import { MatExpansionPanel, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

@Component({
  selector: 'app-access-policy-editor',
  templateUrl: './access-policy-editor.component.html',
  styleUrls: ['./access-policy-editor.component.scss']
})
export class AccessPolicyEditorComponent implements OnInit, AfterViewChecked {
  effects: Effect[] = [Effect.ALLOW, Effect.DENY];

  policy: AccessPolicy;

  now: Date = new Date();

  private modelUpdated: Subject<AccessPolicy> = new Subject();

  @ViewChildren('rulePanel')
  rulePanels: QueryList<MatExpansionPanel>;

  autoExpand = -1;

  validationMessages: ValidationResult[] = [];

  public editorOptions: JsonEditorOptions;

  @ViewChild('policyEditor', {static: true}) editor: JsonEditorComponent;

  @ViewChild('fromPicker', {static: true}) fromPicker: MatDatepicker<any>;

  mode: string;

  datePickerActivationPending: boolean;

  resizeDrag = false;

  constructor(private route: ActivatedRoute, private router: Router, private acessPolicyService: AccessPolicyService,
    private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'tree']; // set all allowed modes
    this.editorOptions.mode = 'code';

    this.editorOptions.onChange = this.onJsonChange.bind(this);
  }

  ngOnInit() {
    // fetch requested policy
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.acessPolicyService.fetchPolicy(params.get('id')))
    ).subscribe(policy => {
      // new policy loaded
      this.policy = policy;
      this.datePickerActivationPending = true;
    });

    // extract mode from url
    this.route.url.subscribe(url => this.mode = url[url.length-1].toString());

    // Validation & feedback
    this.modelUpdated.asObservable()
      .pipe(
        filter(p => !(p == null)),
        distinctUntilChanged((x, y) => x==y, p => JSON.stringify(p)),
        debounceTime(500),
        // tap(p => console.log("Validating: ", p)),
        switchMap(p => this.acessPolicyService.validate(p))
      ).subscribe(
        m => this.validationMessages = m
      );
  }

  ngAfterViewChecked() {
    this.modelUpdated.next(this.policy);

    if (this.autoExpand >= 0) {
      const panels = this.rulePanels.toArray();
      if (panels.length >= this.autoExpand) {
        panels[this.autoExpand].open();
      }

      this.autoExpand = -1;
      this.cdRef.detectChanges();
    }

    if(this.datePickerActivationPending && this.mode == 'clone' && this.fromPicker) {
      timer(500).subscribe(() => {
        console.log("Called open on from picker");
        this.fromPicker.open();
      });

      this.datePickerActivationPending = false;
    }
  }

  addRule(policy: AccessPolicy) {
    this.autoExpand = policy.rules.length;
    policy.rules.push(new AccessRule());
  }

  moveRuleUp(policy: AccessPolicy, index: number) {
    policy.rules.splice(index - 1, 0, ...policy.rules.splice(index, 1));
  }
  moveRuleDown(policy: AccessPolicy, index: number) {
    policy.rules.splice(index + 1, 0, ...policy.rules.splice(index, 1));
  }
  removeRule(policy: AccessPolicy, index: number) {
    policy.rules.splice(index, 1);
  }

  // see https://stackoverflow.com/questions/42322968/angular2-dynamic-input-field-lose-focus-when-input-changes
  trackByIndex(index: any, item: any) {
    return index;
  }

  cancel() {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }

  delete(policy: AccessPolicy) {
    this.acessPolicyService.delete(policy)
      .subscribe(
        success => this.router.navigate(['../../../'], { relativeTo: this.route }),
        error => this.snackBar.open('Failed to delete policy: ' + error.statusText, 'RETRY', { duration: 5000 })
            .onAction().subscribe(() => { this.delete(policy); })
      );
  }

  save(policy: AccessPolicy) {
    // validate before save
    this.acessPolicyService.validate(policy).subscribe(
      result => {
        if(result.length == 0) {
          this.doSave(policy);
        } else {
          const dialogRef = this.dialog.open(ConfirmIgnoreValidationFailuresDialog, {
            data: result
          });

          dialogRef.afterClosed().subscribe(result => {
            if(result) {
              console.log('Saving despite validation failures');
              this.doSave(policy);
            }
          });
        }
      }
    )

  }

  private doSave(policy: AccessPolicy) {
    this.acessPolicyService.saveOrUpdate(policy)
      .subscribe(
        success => this.router.navigate(['../../../'], { relativeTo: this.route }),
        error => this.snackBar.open('Failed to save policy: ' + error.statusText, 'RETRY', { duration: 5000 })
            .onAction().subscribe(() => { this.delete(policy); })
      );
  }

  onTabChange(index: number) {
    switch(index) {
      case 0: // JSON to visual editor
        try {
          this.policy = this.editor.get() as any as AccessPolicy;
        } catch(error) {
          this.snackBar.open('Invalid JSON - reverting...', null, { duration: 3000 });
        }
        break;
      case 1:
        this.editor.set(this.policy as any as JSON);
        break;
    }
  }

  onJsonChange(): any {
    try {
      this.policy = this.editor.get() as any as AccessPolicy;
    } catch(error) {
      // ignore
    }
  }
}

@Component({
  selector: 'confirm-ignore-validation-failures-dialog',
  template: `
    <h1 mat-dialog-title>Validation failures</h1>
    <div mat-dialog-content>
      <p>Are you sure that you want to ignore the following validation messages?</p>
      <br>
      <p>
        <mat-list *ngIf="validationMessages.length > 0">
          <mat-list-item *ngFor="let message of validationMessages">
            <div [ngSwitch]="message.type">
              <i class="fas fa-info-circle" *ngSwitchCase="'INFO'"></i>
              <i class="fas fa-exclamation-circle" *ngSwitchCase="'WARNING'"></i>
              <i class="fas fa-times-circle" *ngSwitchCase="'ERROR'"></i>
            </div>
            &nbsp;{{message.message}}
          </mat-list-item>
        </mat-list>
      <p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">CANCEL</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>SAVE ANYWAY</button>
    </div>
  `,
})
export class ConfirmIgnoreValidationFailuresDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmIgnoreValidationFailuresDialog>,
      @Inject(MAT_DIALOG_DATA) public validationMessages: ValidationResult[]) {}
}
