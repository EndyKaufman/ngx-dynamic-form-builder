import { Routes } from '@angular/router';
import { CustomizationPageComponent } from './customization-page.component';

export const CustomizationPageRoutes: Routes = [
  {
    path: '',
    component: CustomizationPageComponent,
    data: {
      name: 'customization',
      title: 'Customization',
      visible: true,
      svgIcon: 'shape-outline'
    },
    children: []
  }
];
