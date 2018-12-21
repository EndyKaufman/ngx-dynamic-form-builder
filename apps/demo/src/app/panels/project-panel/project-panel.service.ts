import { Injectable } from '@angular/core';
import { environment } from 'apps/demo/src/environments/environment';
import { plainToClass } from 'class-transformer';
import { BehaviorSubject } from 'rxjs';
import { ProjectPanelStepsEnum } from '../../shared/enums/project-panel-steps.enum';
import { Project } from '../../shared/models/project';

@Injectable()
export class ProjectPanelService {
  activatedStep$ = new BehaviorSubject(ProjectPanelStepsEnum.Step1);
  project$ = new BehaviorSubject(
    plainToClass(Project, environment.defaults.project)
  );
  clear() {
    this.project$.next(
      plainToClass(Project, environment.defaults.project)
    );
  }
  store(project: Project) {
    this.project$.next(project);
  }
}
