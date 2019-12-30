import { Component, OnInit, Type, Inject, InjectionToken } from '@angular/core';
import { RequestService } from '@service/request/request.service';
import { ConfigurationService } from '@service/configuration/configuration.service';

/**
 * A descriptor for snap-ins into the system-settings area.
 */
export class SystemSettingsSnapIn {
  /** The type of component providing the functionality */
  public componentType: Type<any>;

  /** The name of the snap-in */
  public name: String = 'Unnamed SnapIn';

  /** The prioroty of the snap-in. Higher values lead to more prominent placement. */
  public priority: 0;
}

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
})
export class SystemSettingsComponent implements OnInit {
  title = 'Neverpile';
  neverpileHostURL: string;

  currentSettingsIndex = -1;

  constructor(private requestService: RequestService, private configurationService: ConfigurationService, @Inject(SystemSettingsSnapIn) public snapIns: SystemSettingsSnapIn[]) {
    this.snapIns.sort((a, b) => (this.prio(b) - this.prio(a)));
    this.neverpileHostURL = configurationService.getNeverpileUrl();
  }

  prio(s: SystemSettingsSnapIn): number {
    return s.priority == null ? 0 : s.priority;
  }

  ngOnInit() {
  }

}
