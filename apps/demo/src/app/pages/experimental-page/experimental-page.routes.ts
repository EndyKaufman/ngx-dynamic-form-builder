import { Routes } from '@angular/router';
import { ExperimentalPageComponent } from './experimental-page.component';
import { marker } from '@ngneat/transloco-keys-manager/marker';

export const ExperimentalPageRoutes: Routes = [
  {
    path: '',
    component: ExperimentalPageComponent,
    data: {
      name: 'experimental',
      title: marker('Experimental + transloco + i18n'),
      visible: true,
    },
    children: [],
  },
];
