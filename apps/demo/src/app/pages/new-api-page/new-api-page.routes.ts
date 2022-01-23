import { Routes } from '@angular/router';
import { NewApiPageComponent } from './new-api-page.component';
import { marker } from '@ngneat/transloco-keys-manager/marker';

export const NewApiPageRoutes: Routes = [
  {
    path: '',
    component: NewApiPageComponent,
    data: {
      name: 'new-api',
      title: marker('New API'),
      visible: true,
    },
    children: [],
  },
];
