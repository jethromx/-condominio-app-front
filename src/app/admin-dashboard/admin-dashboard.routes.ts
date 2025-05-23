import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout/admin-dashboard-layout.component';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { CondominiumsAdminPageComponent } from './pages/condominiums-admin-page/condominiums-admin-page.component';
import { ApartmentsAdminPageComponent } from './pages/apartments-admin-page/apartments-admin-page.component';
import { UsersAdminPageComponent } from './pages/users-admin-page/users-admin-page.component';
import { CondominiumAdminPageComponent } from './pages/condominium-admin-page/condominium-admin-page.component';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    canMatch: [IsAdminGuard],
    children: [
      
      {
        path: 'condominiums',
        component: CondominiumsAdminPageComponent,
      },
      {
        path: 'condominiums/:id',
        component: CondominiumAdminPageComponent,
      },
      {
        path: 'apartments',
        component: ApartmentsAdminPageComponent,
      },
      {
        path: 'users',
        component: UsersAdminPageComponent,
      },      
      {
        path: '**',
        redirectTo: 'condominiums',
      },
    ],
  },
];

export default adminDashboardRoutes;
