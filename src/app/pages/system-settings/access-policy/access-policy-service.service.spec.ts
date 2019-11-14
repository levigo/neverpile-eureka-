import { TestBed, inject } from '@angular/core/testing';

import { AccessPolicyService } from './access-policy-service.service';

describe('AccessPolicyServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessPolicyService]
    });
  });

  it('should be created', inject([AccessPolicyService], (service: AccessPolicyService) => {
    expect(service).toBeTruthy();
  }));
});
