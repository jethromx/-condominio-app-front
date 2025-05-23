import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { CondominioFrontLayoutComponent } from './layouts/condominio-front-layout/condominio-front-layout.component';

export const condominioFrontRoutes: Routes = [
  {
    path: '',
    component: CondominioFrontLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },


      {
        path: '**',
        component: NotFoundPageComponent,
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];

export default condominioFrontRoutes;
