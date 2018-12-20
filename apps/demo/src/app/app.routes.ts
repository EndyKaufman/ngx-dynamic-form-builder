import { Routes } from '@angular/router';
import { HomePageRoutes } from './pages/home-page/home-page.routes';
import { AdvancedPageRoutes } from './pages/advanced-page/advanced-page.routes';
import { SimplePageRoutes } from './pages/simple-page/simple-page.routes';
import { ExperimentalPageRoutes } from './pages/experimental-page/experimental-page.routes';
import { CustomizationPageRoutes } from './pages/customization-page/customization-page.routes';
import { ProjectPageRoutes } from './pages/project-page/project-page.routes';

export const AppRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: './pages/home-page/home-page.module#HomePageModule',
    data: HomePageRoutes[0].data
  },
  {
    path: 'simple',
    loadChildren: './pages/simple-page/simple-page.module#SimplePageModule',
    data: SimplePageRoutes[0].data
  },
  {
    path: 'advanced',
    loadChildren: './pages/advanced-page/advanced-page.module#AdvancedPageModule',
    data: AdvancedPageRoutes[0].data
  },
  {
    path: 'experimental',
    loadChildren: './pages/experimental-page/experimental-page.module#ExperimentalPageModule',
    data: ExperimentalPageRoutes[0].data
  },
  {
    path: 'project',
    loadChildren: './pages/project-page/project-page.module#ProjectPageModule',
    data: ProjectPageRoutes[0].data
  },
  {
    path: 'customization',
    loadChildren: './pages/customization-page/customization-page.module#CustomizationPageModule',
    data: CustomizationPageRoutes[0].data
  },
  {
    path: 'github',
    redirectTo: 'https://github.com/EndyKaufman/ngx-dynamic-form-builder',
    data: {
      name: 'github',
      title: 'github',
      svgIcon: `github-circle`,
      visible: true
    }
  }/*,
  {
    path: '**',
    redirectTo: 'home'
  }*/
];
