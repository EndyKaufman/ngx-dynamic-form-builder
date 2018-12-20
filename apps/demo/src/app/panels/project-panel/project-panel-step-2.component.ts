import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../../shared/models/project';
import { Task } from '../../shared/models/task';
import { ProjectPanelService } from './project-panel.service';

@Component({
  selector: 'project-panel-step-2',
  templateUrl: './project-panel-step-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPanelStep2Component implements OnDestroy {
  tasks: FormArray;
  form: DynamicFormGroup<Project>;
  project: Project;
  project$: Observable<Project>;

  fb = new DynamicFormBuilder();

  private _destroyed$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _projectPanelService: ProjectPanelService
  ) {
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
        groups: 'step-2'
      }
    });
  }
  createTaskControl() {
    return this.fb.group(Task, {
      description: 'new task'
    });
  }
  addTask(): void {
    this.tasks = this.form.get('tasks') as FormArray;
    this.tasks.push(
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
  onClearClick(): void {
    this._projectPanelService.clear();
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
