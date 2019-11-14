import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAndDropContentUploadComponent } from '@component/upload-file/content-upload/drag-and-drop/drag-and-drop.component';

describe('DragAndDropContentUploadComponent', () => {
  let component: DragAndDropContentUploadComponent;
  let fixture: ComponentFixture<DragAndDropContentUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragAndDropContentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropContentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
