import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { CondominiumTableComponent } from 'src/app/condominiums/componentes/condominium-table/condominium-table.component';
import { CondominiumsService } from 'src/app/condominiums/services/condominiums.service';
import { PaginationRowPerPageComponent } from "../../../shared/components/pagination/pagination-row-per-page/pagination-row-per-page.component";

@Component({
  selector: 'condominiums-admin-page',
  imports: [CondominiumTableComponent, PaginationComponent, RouterLink, PaginationRowPerPageComponent],
  templateUrl: './condominiums-admin-page.component.html',
})
export class CondominiumsAdminPageComponent {
  condominiumService = inject(CondominiumsService);
  paginationService = inject(PaginationService);

  condominiumsPerPage = signal(10);

  condominiumsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.condominiumsPerPage(),
    }),
    loader: ({ request }) => {
      return this.condominiumService.getCondominiums({
        page: request.page * 9,
        limit: request.limit,
      });
    },
  });
 }
