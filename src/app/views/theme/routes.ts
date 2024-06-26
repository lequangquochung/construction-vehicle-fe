import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Category'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CategoryComponent
      }
      // {
      //   path: '',
      //   redirectTo: 'colors',
      //   pathMatch: 'full'
      // },
      // {
      //   path: '',
      //   loadComponent: () => import('./colors.component').then(m => m.ColorsComponent),
      //   data: {
      //     title: 'Colors'
      //   }
      // },
      // {
      //   path: 'typography',
      //   loadComponent: () => import('./typography.component').then(m => m.TypographyComponent),
      //   data: {
      //     title: 'Typography'
      //   }
      // }
    ]
  }
];

