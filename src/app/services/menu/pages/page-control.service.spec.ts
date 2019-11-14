import { TestBed, inject } from '@angular/core/testing';

import { PageControlService } from '@service/menu/pages/page-control.service';

describe('PageControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageControlService]
    });
  });

  it('should be created', inject([PageControlService], (service: PageControlService) => {
    expect(service).toBeTruthy();
  }));
});
