import { Routes } from '@angular/router';
import { ComboPageComponent } from './combo-page.component';

export const ComboPageRoutes: Routes = [
  {
    path: '',
    component: ComboPageComponent,
    data: {
      name: 'combo',
      title: 'Combo',
      visible: true
    },
    children: []
  }
];
