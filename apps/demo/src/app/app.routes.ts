import { Routes } from '@angular/router';
import { AdvancedPageRoutes } from './pages/advanced-page/advanced-page.routes';
import { ComboPageRoutes } from './pages/combo-page/combo-page.routes';
import { ExperimentalPageRoutes } from './pages/experimental-page/experimental-page.routes';
import { HomePageRoutes } from './pages/home-page/home-page.routes';
import { I18nPageRoutes } from './pages/i18n-page/i18n-page.routes';
import { NewApiPageRoutes } from './pages/new-api-page/new-api-page.routes';
import { ProjectPageRoutes } from './pages/project-page/project-page.routes';
import { SimplePageRoutes } from './pages/simple-page/simple-page.routes';

export const AppRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home-page/home-page.module').then(
        (m) => m.HomePageModule
      ),
    data: HomePageRoutes[0].data,
  },
  {
    path: 'simple',
    loadChildren: () =>
      import('./pages/simple-page/simple-page.module').then(
        (m) => m.SimplePageModule
      ),
    data: SimplePageRoutes[0].data,
  },
  {
    path: 'combo',
    loadChildren: () =>
      import('./pages/combo-page/combo-page.module').then(
        (m) => m.ComboPageModule
      ),
    data: ComboPageRoutes[0].data,
  },
  {
    path: 'advanced',
    loadChildren: () =>
      import('./pages/advanced-page/advanced-page.module').then(
        (m) => m.AdvancedPageModule
      ),
    data: AdvancedPageRoutes[0].data,
  },
  {
    path: 'i18n',
    loadChildren: () =>
      import('./pages/i18n-page/i18n-page.module').then(
        (m) => m.I18nPageModule
      ),
    data: I18nPageRoutes[0].data,
  },
  {
    path: 'experimental',
    loadChildren: () =>
      import('./pages/experimental-page/experimental-page.module').then(
        (m) => m.ExperimentalPageModule
      ),
    data: ExperimentalPageRoutes[0].data,
  },
  {
    path: 'project',
    loadChildren: () =>
      import('./pages/project-page/project-page.module').then(
        (m) => m.ProjectPageModule
      ),
    data: ProjectPageRoutes[0].data,
  },
  {
    path: 'new-api',
    loadChildren: () =>
      import('./pages/new-api-page/new-api-page.module').then(
        (m) => m.NewApiPageModule
      ),
    data: NewApiPageRoutes[0].data,
  },
  {
    path: 'github',
    redirectTo: 'https://github.com/EndyKaufman/ngx-dynamic-form-builder',
    data: {
      name: 'github',
      title: 'github',
      svgIcon: `github-circle`,
      visible: true,
      hideTitle: true,
    },
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
