import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Manager Order'
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
                loadComponent: () => import('./manage-order/manage-order.component').then(m => m.ManageOrderComponent)
            },
        ]
    }
]