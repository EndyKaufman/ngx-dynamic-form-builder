import { Routes } from '@angular/router';
import { SimplePageComponent } from './simple-page.component';

export const SimplePageRoutes: Routes = [
  {
    path: '',
    component: SimplePageComponent,
    data: {
      name: 'simple',
      title: 'Simple',
      visible: true
    },
    children: []
  }
];
