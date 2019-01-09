import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectPanelService } from '../../panels/project-panel/project-panel.service';
import { ProjectPanelStepsEnum } from '../../shared/enums/project-panel-steps.enum';

@Component({
  selector: 'project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  @ViewChild('doc')
  doc: any;

  activatedStep$: Observable<string>;

  sources = {
    [ProjectPanelStepsEnum.Step1]: {
      html: require('!!raw-loader?lang=html!./../../panels/project-panel/project-panel-step-1.component.html'),
      ts: require('!!raw-loader?lang=typescript!./../../panels/project-panel/project-panel-step-1.component.ts')
    },
    [ProjectPanelStepsEnum.Step2]: {
      html: require('!!raw-loader?lang=html!./../../panels/project-panel/project-panel-step-2.component.html'),
      ts: require('!!raw-loader?lang=typescript!./../../panels/project-panel/project-panel-step-2.component.ts')
    },
    [ProjectPanelStepsEnum.Complete]: {
      html: require('!!raw-loader?lang=html!./../../panels/project-panel/project-panel-complete.component.html'),
      ts: require('!!raw-loader?lang=typescript!./../../panels/project-panel/project-panel-complete.component.ts')
    }
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'project.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/project.ts')
    },
    {
      name: 'task.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/task.ts')
    },
    {
      name: 'project-panel.service.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../panels/project-panel/project-panel.service.ts')
    },
    {
      name: 'environments.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../../environments/environment.ts')
    },
    {
      name: 'environment.interface.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../../environments/environment.interface.ts')
    },
    {
      name: 'project-panel-steps.enum.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/enums/project-panel-steps.enum.ts')
    },
    {
      name: 'project-page.routes.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../pages/project-page/project-page.routes.ts')
    },
  ];

  private _destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _projectPanelService: ProjectPanelService
  ) {
    this.activatedStep$ = this._projectPanelService.activatedStep$.asObservable().pipe(
      takeUntil(this._destroyed$)
    );
    this.activatedStep$.subscribe(step => {
      if (this.doc && this.doc.view && this.doc.view.code) {
        this.doc.view.code.active = false;
      }
    });
  }
  ngOnInit(): void {
    this._projectPanelService.clear();
  }
  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
