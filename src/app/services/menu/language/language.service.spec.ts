import { TestBed, inject } from '@angular/core/testing';

import { LanguageService } from '@service/menu/language/language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageService]
    });
  });

  it('should be created', inject([LanguageService], (service: LanguageService) => {
    expect(service).toBeTruthy();
  }));
});
