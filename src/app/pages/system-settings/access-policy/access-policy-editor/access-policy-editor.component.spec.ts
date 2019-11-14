import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPolicyEditorComponent } from './access-policy-editor.component';

describe('AccessPolicyEditorComponent', () => {
  let component: AccessPolicyEditorComponent;
  let fixture: ComponentFixture<AccessPolicyEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessPolicyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessPolicyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
