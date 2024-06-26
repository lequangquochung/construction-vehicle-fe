import { CategoryListComponent } from './category-list/category-list.component';
import { Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Category List'
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
                loadComponent: () => import('./category-list/category-list.component').then(m => m.CategoryListComponent)
            },
            {
                path: 'new',
                loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent)
            }
        ]
    }
]