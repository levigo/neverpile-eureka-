import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMaintenanceComponent } from './index-maintenance.component';

describe('IndexMaintenanceComponent', () => {
  let component: IndexMaintenanceComponent;
  let fixture: ComponentFixture<IndexMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
