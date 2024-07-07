import { AccessaryComponent } from './views/pages/client-page/accessary/accessary.component';
import { ProductsComponent } from './views/pages/client-page/products/products.component';
import { ContactUsComponent } from './views/pages/client-page/contact-us/contact-us.component';
import { InstallmentComponent } from './views/pages/client-page/installment/installment.component';
import { ParkingLotComponent } from './views/pages/client-page/parking-lot/parking-lot.component';
import { PreviewComponent } from './views/pages/client-page/preview/preview.component';
import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { DefaultLayoutComponent } from './layout';
import { AboutUsComponent } from './views/pages/client-page/about-us/about-us.component';
import { DashboardClientComponent } from './views/pages/client-page/dashboard-client/dashboard-client.component';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardClientComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: PreviewComponent
      }
      ,
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: 'parking',
        component: ParkingLotComponent
      },
      {
        path: 'installment',
        component: InstallmentComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'product-accessary',
        component: AccessaryComponent
      }
    ]
  },
  {
    path: 'auth',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'category',
        loadChildren: () => import('./views/pages/auth/category-module/category.routes').then(m => m.routes)
      },
      {
        path: 'product',
        loadChildren: () => import('./views/pages/auth/product-module/product.routes').then(m => m.routes)
      }
      ,
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      // {
      //   path: 'buttons',
      //   loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'forms',
      //   loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'icons',
      //   loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'pages',
      //   loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      // }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: '' },

]
