import { Routes } from '@angular/router';
import { ExperimentalPageComponent } from './experimental-page.component';

export const ExperimentalPageRoutes: Routes = [
  {
    path: '',
    component: ExperimentalPageComponent,
    data: {
      name: 'experimental',
      /**
       * t(Experimental + i18n)
       */
      title: 'Experimental + i18n',
      visible: true,
    },
    children: [],
  },
];
