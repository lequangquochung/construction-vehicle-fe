import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Brand List'
        },
        children: [
            {
                path: '',
                redirectTo:'list',
                pathMatch:'full',
            },
            {
                path: 'list',
                pathMatch: 'full',
                loadComponent: () => import('./brand-list/brand-list.component').then(m => m.BrandListComponent)
            },
            {
                path: 'new',
                title: 'New Product',
                loadComponent: () => import('./brand/brand.component').then(m => m.BrandComponent)
            }
        ]
    }
]