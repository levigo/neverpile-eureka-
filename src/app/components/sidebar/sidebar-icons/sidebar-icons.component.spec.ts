import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarIconsComponent } from '@component/sidebar/sidebar-icons/sidebar-icons.component';

describe('SidebarIconsComponent', () => {
  let component: SidebarIconsComponent;
  let fixture: ComponentFixture<SidebarIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
