import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from '../../shared/models/project';
import { ProjectPanelService } from './project-panel.service';

@Component({
  selector: 'project-panel-complete',
  templateUrl: './project-panel-complete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPanelCompleteComponent {
  project$: Observable<Project>;
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _projectPanelService: ProjectPanelService
  ) {
    this.project$ = this._projectPanelService.project$;
  }
  onPrevStepClick(): void {
    this._router.navigate(['../step-2'], { relativeTo: this._activatedRoute });
  }
}
