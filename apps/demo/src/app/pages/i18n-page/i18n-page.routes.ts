import { Routes } from '@angular/router';
import { I18nPageComponent } from './i18n-page.component';

export const I18nPageRoutes: Routes = [
  {
    path: '',
    component: I18nPageComponent,
    data: {
      name: 'i18n',
      title: 'i18n',
      visible: true,
    },
    children: [],
  },
];
