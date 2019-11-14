import { Component, OnInit, Injectable } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { AccessPolicyService, AccessPolicy } from '@page/system-settings/access-policy/access-policy-service.service';
import { Router, ActivatedRoute } from '@angular/router';

export enum Timeline {
  OBSOLETE = 'obsolete', CURRENT = 'current', UPCOMING = 'upcoming'
}
export interface TimelinedAccessPolicy extends AccessPolicy {
  timeline?: Timeline;
}

@Component({
  selector: 'app-access-policy',
  templateUrl: './access-policy.component.html',
  styleUrls: ['./access-policy.component.scss'],
})
export class AccessPolicyComponent implements OnInit {

  readonly policyListDataSource = new MatTableDataSource<TimelinedAccessPolicy>([]);

  displayedColumns: string[] = ['timeline', 'valid_from', 'description', 'actions'];

  from: Date;
  to: Date;

  fetchCurrentInProgress = false;
  refreshInProgress = false;

  currentPolicy: AccessPolicy;

  constructor( private accessPolicyService: AccessPolicyService, public snackBar: MatSnackBar, public router: Router,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.from = new Date();
    this.from.setTime(this.from.getTime() - 90 * 86400 * 1000);

    this.to = new Date();
    this.to.setTime(this.to.getTime() + 90 * 86400 * 1000);

    this.fetchCurrentPolicy();

    this.refreshTable();
  }

  fetchCurrentPolicy() {
    this.fetchCurrentInProgress = true;

    this.accessPolicyService.fetchCurrentPolicy().subscribe( policy => {
      this.fetchCurrentInProgress = false;
      this.currentPolicy = policy;
      this.updateTimeline();
    },
    error => {
      this.currentPolicy = null;
      this.fetchCurrentInProgress = false;

      this.snackBar.open('Failed to retrieve current policy: ' + error.statusText, 'RETRY', { duration: 5000 })
        .onAction().subscribe(() => { this.fetchCurrentPolicy(); });
    });
  }

  refreshTable() {
    this.refreshInProgress = true;
    this.policyListDataSource.data = [];

    this.accessPolicyService.fetchPolicies(this.from, this.to).subscribe( policies => {
      this.refreshInProgress = false;
      this.policyListDataSource.data = policies;
      this.updateTimeline();
    },
    error => {
      this.refreshInProgress = false;

      this.snackBar.open('Failed to retrieve list of policies: ' + error.statusText, 'RETRY', { duration: 5000 })
        .onAction().subscribe(() => { this.refreshTable(); });
    });
  }

  updateTimeline() {
    this.policyListDataSource.data = this.policyListDataSource.data.map(p => this.timeline(p));
  }

  timeline(policy: AccessPolicy): TimelinedAccessPolicy {
    const t: TimelinedAccessPolicy = policy;

    if (this.currentPolicy && t.valid_from.getTime() === this.currentPolicy.valid_from.getTime()) {
      t.timeline = Timeline.CURRENT;
    } else if (t.valid_from > new Date()) {
      t.timeline = Timeline.UPCOMING;
    } else {
      t.timeline = Timeline.OBSOLETE;
    }

    return t;
  }

  edit(timeline: Timeline, valid_from: Date) {
    if (timeline === Timeline.UPCOMING) {
      this.router.navigate(['access-policy', valid_from.toISOString(), 'edit'], { relativeTo: this.route });
    }
  }

  editClone(timeline: Timeline, valid_from: Date) {
    if (timeline === Timeline.CURRENT || timeline === Timeline.UPCOMING) {
      this.router.navigate(['access-policy', valid_from.toISOString(), 'clone'], { relativeTo: this.route });
    }
  }
}
