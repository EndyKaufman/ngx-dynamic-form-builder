import { Routes } from '@angular/router';
import { ExperimentalPageComponent } from './experimental-page.component';

export const ExperimentalPageRoutes: Routes = [
  {
    path: '',
    component: ExperimentalPageComponent,
    data: {
      name: 'experimental',
      title: 'Experimental',
      visible: true
    },
    children: []
  }
];
