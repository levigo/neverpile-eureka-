import { TestBed, inject } from '@angular/core/testing';

import { DocumentService } from '@service/document/document.service';

describe('DocumentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentService]
    });
  });

  it('should be created', inject([DocumentService], (service: DocumentService) => {
    expect(service).toBeTruthy();
  }));
});
