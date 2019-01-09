import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../../shared/models/project';
import { ProjectPanelService } from './project-panel.service';

@Component({
  selector: 'project-panel-complete',
  templateUrl: './project-panel-complete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPanelCompleteComponent implements OnDestroy {
  project$: Observable<Project>;
  private _destroyed$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _projectPanelService: ProjectPanelService
  ) {
    this._activatedRoute.data.pipe(
      takeUntil(this._destroyed$)
    ).subscribe(
      data => this._projectPanelService.activatedStep$.next(
        data.step
      )
    );
    this.project$ = this._projectPanelService.project$;
  }
  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
  onPrevStepClick(): void {
    this._router.navigate(['../step-2'], { relativeTo: this._activatedRoute });
  }
}
