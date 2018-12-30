import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../../shared/models/project';
import { Task } from '../../shared/models/task';
import { ProjectPanelService } from './project-panel.service';
import { ProjectPanelStepsEnum } from '../../shared/enums/project-panel-steps.enum';

@Component({
  selector: 'project-panel-step-2',
  templateUrl: './project-panel-step-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPanelStep2Component implements OnDestroy {
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
        groups: [ProjectPanelStepsEnum.Step2]
      }
    });
  }
  createTaskControl() {
    return this.fb.group(Task);
  }
  getTasksArray() {
    return this.form.get('tasks') as FormArray;
  }
  addTask(): void {
    this.getTasksArray().push(
      this.createTaskControl()
    );
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
  onPrevStepClick(): void {
    this._projectPanelService.store(this.form.object);
    this._router.navigate(['../step-1'], { relativeTo: this._activatedRoute });
  }
  onNextStepClick(): void {
    this._projectPanelService.store(this.form.object);
    this._router.navigate(['../complete'], { relativeTo: this._activatedRoute });
  }
}
