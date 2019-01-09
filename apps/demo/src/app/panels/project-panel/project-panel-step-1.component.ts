import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectPanelStepsEnum } from '../../shared/enums/project-panel-steps.enum';
import { Project } from '../../shared/models/project';
import { ProjectPanelService } from './project-panel.service';

@Component({
  selector: 'project-panel-step-1',
  templateUrl: './project-panel-step-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPanelStep1Component implements OnDestroy {
  @Input()
  clear: boolean;

  form: DynamicFormGroup<Project>;
  project$: Observable<Project>;

  fb = new DynamicFormBuilder();

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
    this.form = this.createForm();
    this.project$ = this._projectPanelService.project$;
    this.subscribeToProject();
  }
  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
  createForm() {
    return this.fb.group(Project, {
      customValidatorOptions: {
        groups: [ProjectPanelStepsEnum.Step1]
      }
    });
  }
  subscribeToProject() {
    this.project$.pipe(
      takeUntil(this._destroyed$)
    ).subscribe(
      project =>
        this.loadFormData(project)
    );
  }
  loadFormData(project: Project): void {
    this.form.object = project;
    this.form.validateAllFormFields();
  }
  onClearClick(): void {
    this._projectPanelService.clear();
  }
  onNextStepClick(): void {
    if (this.form.valid) {
      this._projectPanelService.store(this.form.object);
      this._router.navigate(['../step-2'], { relativeTo: this._activatedRoute });
    } else {
      this.form.validateAllFormFields();
    }
  }
}
