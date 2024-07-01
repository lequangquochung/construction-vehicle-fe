import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Product List'
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
                loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent)
            },
            {
                path: 'new',
                title: 'New Product',
                loadComponent: () => import('./product/product.component').then(m => m.ProductComponent)
            }
        ]
    }
]