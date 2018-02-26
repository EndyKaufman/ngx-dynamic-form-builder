import { Routes } from '@angular/router';
import { HomePageRoutes } from './pages/home-page/home-page.routes';
import { AdvancedPageRoutes } from './pages/advanced-page/advanced-page.routes';

export const AppRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: './pages/home-page/home-page.module#HomePageModule',
        data: HomePageRoutes[0].data
    },
    {
        path: 'advanced',
        loadChildren: './pages/advanced-page/advanced-page.module#AdvancedPageModule',
        data: AdvancedPageRoutes[0].data
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
    },
    {
        path: '**',
        redirectTo: 'home'
    },
];
