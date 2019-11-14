import { TestBed, inject } from '@angular/core/testing';

import { I18NSnapInRegistry } from './i18n.service';

describe('I18nService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18NSnapInRegistry]
    });
  });

  it('should be created', inject([I18NSnapInRegistry], (service: I18NSnapInRegistry) => {
    expect(service).toBeTruthy();
  }));
});
