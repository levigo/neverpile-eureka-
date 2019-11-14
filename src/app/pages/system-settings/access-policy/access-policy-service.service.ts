import { Injectable, OnInit } from '@angular/core';
import { RequestService } from '@service/request/request.service';
import { environment } from '@environments/environment';
import { Observable, ErrorObserver, of } from 'rxjs';
import { catchError, retry, tap, map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

export enum Effect {
  ALLOW = 'ALLOW', DENY = 'DENY'
}

export class AccessRule {
  constructor(
      public name: string = '',
      public effect: Effect = Effect.DENY,
      public subjects: Array<string> = [],
      public resources: Array<string> = [],
      public actions: Array<string> = [],

      // for now, we don't have any qualified support for conditions, so they are just an object
      public conditions: Object = {}
    ) {}
}

export class Hint {
  constructor(
    public prefix: String,
    public documentationKey: String
  ) {}
}

export class Hints {
  constructor(
    public actions: Array<Hint>,
    public subjects: Array<Hint>,
    public resources: Array<Hint>,
  ) {}
}

export class AccessPolicy {
  constructor(
    // FIXME: find out how to customize the JSON mapping. The API uses snake_case,
    // as it follows https://opensource.zalando.com/restful-api-guidelines/#json-guidelines,
    // whereas here we'd prefer camels.
    public valid_from: Date,
    public description: string,
    public default_effect: Effect = Effect.DENY,
    public rules: Array<AccessRule> = []) {}
}

export enum Type {
  INFO = 'INFO', WARNING = 'WARNING', ERROR = 'ERROR'
}

export class ValidationResult {
  constructor(public type: Type,
    public message: String) { }
}

@Injectable({
  providedIn: 'root'
})
export class AccessPolicyService {
  policyRepositoryUrl: string;

  constructor(private requestService: RequestService) {
    this.policyRepositoryUrl = environment.neverpileUrl + '/api/v1/authorization/policy';
  }

  fetchCurrentPolicy(): Observable<AccessPolicy> {
    return this.requestService
      .request(this.policyRepositoryUrl + '/current')
      .get<AccessPolicy>()
      .pipe(retry(3))
      .pipe(tap(this.unmarshalAccessPolicy));
  }

  fetchPolicy(policyId: string): Observable<AccessPolicy> {
    return this.requestService
      .request(this.policyRepositoryUrl + '/' + policyId)
      .get<AccessPolicy>()
      .pipe(retry(3))
      .pipe(tap(this.unmarshalAccessPolicy));
  }

  fetchPolicies(from: Date, to: Date): Observable<Array<AccessPolicy>> {
    const request = this.requestService.request(this.policyRepositoryUrl);

    if (from) { request.withParam('from', from.toISOString()); }
    if (to) { request.withParam('to', to.toISOString()); }

    return request.get<Array<AccessPolicy>>()
      .pipe(retry(3))
      .pipe(tap(policies => policies.forEach(this.unmarshalAccessPolicy)));
  }

  private unmarshalAccessPolicy(policy: AccessPolicy): void {
    policy.valid_from = new Date(policy.valid_from);
  }

  saveOrUpdate(policy: AccessPolicy): Observable<any> {
    if(typeof policy.valid_from === "string"){
      policy.valid_from = new Date(policy.valid_from);
    }
    return this.requestService.request(this.policyRepositoryUrl + '/' + policy.valid_from.toISOString())
      .put(policy)
  }

  delete(policy: AccessPolicy): Observable<any> {
    if(typeof policy.valid_from === "string"){
      policy.valid_from = new Date(policy.valid_from);
    }
    return this.requestService.request(this.policyRepositoryUrl + '/' + policy.valid_from.toISOString())
      .delete()
  }

  validate(policy: AccessPolicy): Observable<Array<ValidationResult>> {
    return this.requestService.request(this.policyRepositoryUrl + '/validate')
      .post<Array<ValidationResult>>(policy)
      .pipe(
        // remap call errors to validation failures
        catchError(err => of([new ValidationResult(Type.ERROR, err.message)]))
      );
  }

  private hintsCache: Observable<Hints>;

  fetchHints(): Observable<Hints> {
    if(!this.hintsCache) {
      return this.requestService.request(this.policyRepositoryUrl + '/hints')
        .get<Hints>()
        .pipe(
          shareReplay(1)
        );
    }

    return this.hintsCache;
  }
}
