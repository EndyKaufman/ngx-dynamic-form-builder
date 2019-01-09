import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page.component';

export const HomePageRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: {
      name: 'home',
      title: 'Home',
      visible: false,
      align: 'left'
    },
    children: []
  }
];
