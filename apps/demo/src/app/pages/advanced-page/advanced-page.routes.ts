import { Routes } from '@angular/router';
import { AdvancedPageComponent } from './advanced-page.component';

export const AdvancedPageRoutes: Routes = [
  {
    path: '',
    component: AdvancedPageComponent,
    data: {
      name: 'advanced',
      title: 'Advanced',
      visible: true
    },
    children: []
  }
];
