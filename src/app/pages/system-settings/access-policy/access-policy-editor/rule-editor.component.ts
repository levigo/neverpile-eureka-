import { Component, OnInit, Input, ViewChild, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { AccessRule, Effect, AccessPolicyService, Hints, Hint } from '../access-policy-service.service';
import { NgForm } from '@angular/forms';
import { Subscription, Observable, Subject } from 'rxjs';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
import { FocusableOption } from '@angular/cdk/a11y';
import { switchMap, map, startWith, filter } from 'rxjs/operators';


@Component({
  selector: 'app-rule-editor',
  templateUrl: './rule-editor.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .mat-list .mat-list-item {
      height: 35px
    }
    #jsonEditorContainer{
      min-height: 210px;
      overflow: auto;
      resize: vertical;
      padding: 0 8px 8px 0;
    }
    ::ng-deep mat-form-field{
      min-width: 350px;
    }
  `]
})
export class RuleEditorComponent implements OnInit {
  effects: Effect[] = [Effect.ALLOW, Effect.DENY];

  @Input()
  rule: AccessRule;

  formChangesSubscription: Subscription;

  @ViewChild('conditionEditor', {static: true}) editor: JsonEditorComponent;

  public editorOptions: JsonEditorOptions;

  hints: Observable<Hints>;

  subjectHints: Observable<Hint[]>;
  resourceHints: Observable<Hint[]>;
  actionHints: Observable<Hint[]>;
  resizeDrag = false;

  constructor(private accessPolicyService: AccessPolicyService) {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'tree']; // set all allowed modes
    this.editorOptions.mode = 'code';
  }

  ngOnInit() {
    this.hints = this.accessPolicyService.fetchHints();
    this.subjectHints = this.hints.pipe(map(h => h.subjects));
    this.resourceHints = this.hints.pipe(map(h => h.resources));
    this.actionHints = this.hints.pipe(map(h => h.actions));
  }

  onEditorBlur(event: FocusEvent) {
    if(this.editor.jsonEditorContainer.nativeElement.contains(event.relatedTarget))
      return; // this is just a focus transfer within the editor

    try {
      const changedJson = this.editor.get();
      this.rule.conditions = changedJson;
    } catch(error) {
      // thrown on invalid content
    }
  }

  addSubject(rule: AccessRule) {
    rule.subjects.push('');
  }

  resizeEditorStart(){
    this.resizeDrag = true;
  }

  resizeEditorEnd(){
    if(this.resizeDrag){
      this.resizeDrag = false;
      this.editor["editor"].resize();
    }
  }
}

@Component({
  selector: 'string-list-editor',
  template: `
  <mat-list *ngIf="hints | async as hints">
    <mat-list-item *ngFor="let subject of input(); let i = index; trackBy:trackByIndex">
      <mat-form-field floatLabel="never">
        <input matInput
          [placeholder]="placeholder"
          [(ngModel)]="entries[i]"
          name="{{name}}-{{i}}"
          (input)="pruneAndFilter(inputField.value)"
          (focus)="pruneAndFilter(inputField.value)"
          [matAutocomplete]="autocomplete"
          (keydown.enter)="$event.preventDefault()"
          #inputField>
        <mat-autocomplete #autocomplete="matAutocomplete">
          <mat-option *ngFor="let hint of filteredHints | async" [value]="hint.prefix">
            {{hint.prefix}}<small> - {{hint.documentationKey | translate}}</small>
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
    </mat-list-item>
  </mat-list>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .mat-list .mat-list-item {
      height: 35px
    }
  `]
})
export class StringListEditorComponent implements OnInit {
  @Input()
  name: string;

  @Input()
  placeholder: string;

  @Input()
  entries: string[];

  @Input()
  hints: Observable<Hint[]>;

  filter: Subject<string> = new Subject();
  filteredHints: Observable<Hint[]>;

  ngOnInit() {
    this.pruneAndFilter('');
    this.filteredHints = this.filter
      .pipe(
        startWith(''),
        switchMap(pattern =>
          this.hints.pipe(
            map(hints => hints.filter(hint => hint.prefix.indexOf(pattern) === 0))
          )
        )
      );
  }

  input(): string[] {
    return [...this.entries, ""];
  }

  pruneAndFilter(value: string) {
    // replace array contents with maintained contents. might be done rookie-ish...
    const maintained = this.entries.map(e => e.trim()).filter(e => e.length > 0);
    this.entries.splice(0, this.entries.length, ...maintained);

    // update filter
    this.filter.next(value);
  }

  // see https://stackoverflow.com/questions/42322968/angular2-dynamic-input-field-lose-focus-when-input-changes
  trackByIndex(index: any, item: any) {
    return index;
  }
}
