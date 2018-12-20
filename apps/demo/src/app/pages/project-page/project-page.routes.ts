import { Routes } from '@angular/router';
import { ProjectPanelCompleteComponent } from '../../panels/project-panel/project-panel-complete.component';
import { ProjectPanelStep1Component } from '../../panels/project-panel/project-panel-step-1.component';
import { ProjectPanelStep2Component } from '../../panels/project-panel/project-panel-step-2.component';
import { ProjectPageComponent } from './project-page.component';

export const ProjectPageRoutes: Routes = [
  {
    path: '',
    component: ProjectPageComponent,
    data: {
      name: 'project',
      title: 'Arrays with steps',
      visible: true
    },
    children: [
      {
        path: '', redirectTo: '/project/step-1', pathMatch: 'full'
      },
      {
        path: 'step-1',
        component: ProjectPanelStep1Component,
      },
      {
        path: 'step-2',
        component: ProjectPanelStep2Component,
      },
      {
        path: 'complete',
        component: ProjectPanelCompleteComponent,
      }
    ]
  }
];
