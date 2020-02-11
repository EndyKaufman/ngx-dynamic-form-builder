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
      html: require('!!raw-loader!./../../panels/project-panel/project-panel-step-1.component.html').default,
      ts: require('!!raw-loader!./../../panels/project-panel/project-panel-step-1.component.ts').default
    },
    [ProjectPanelStepsEnum.Step2]: {
      html: require('!!raw-loader!./../../panels/project-panel/project-panel-step-2.component.html').default,
      ts: require('!!raw-loader!./../../panels/project-panel/project-panel-step-2.component.ts').default
    },
    [ProjectPanelStepsEnum.Complete]: {
      html: require('!!raw-loader!./../../panels/project-panel/project-panel-complete.component.html').default,
      ts: require('!!raw-loader!./../../panels/project-panel/project-panel-complete.component.ts').default
    }
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'project.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/project.ts').default
    },
    {
      name: 'task.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/task.ts').default
    },
    {
      name: 'project-panel.service.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../panels/project-panel/project-panel.service.ts').default
    },
    {
      name: 'environments.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../../environments/environment.ts').default
    },
    {
      name: 'environment.interface.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../../environments/environment.interface.ts').default
    },
    {
      name: 'project-panel-steps.enum.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/enums/project-panel-steps.enum.ts').default
    },
    {
      name: 'project-page.routes.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../pages/project-page/project-page.routes.ts').default
    },
    {
      name: 'custom-transforms.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/utils/custom-transforms.ts').default
    },
    {
      name: 'custom-validators.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/utils/custom-validators.ts').default
    }
  ];

  private _destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(private _projectPanelService: ProjectPanelService) {
    this.activatedStep$ = this._projectPanelService.activatedStep$.asObservable().pipe(takeUntil(this._destroyed$));
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
