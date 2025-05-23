import { Component, inject } from '@angular/core';
import { CondominiumsService } from '../../services/condominiums.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CondomoniumCardComponent } from '../../componentes/condomonium-card/condomonium-card.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-home-page',
  imports: [CondomoniumCardComponent,PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent { 
  productsService = inject(CondominiumsService);
  paginationService = inject(PaginationService);
  
    // activatedRoute = inject(ActivatedRoute);
  
    // currentPage = toSignal(
    //   this.activatedRoute.queryParamMap.pipe(
    //     map((params) => (params.get('page') ? +params.get('page')! : 1)),
    //     map((page) => (isNaN(page) ? 1 : page))
    //   ),
    //   {
    //     initialValue: 1,
    //   }
    // );
  
    productsResource = rxResource({
      request: () => ({ page: this.paginationService.currentPage() - 1 }),
      loader: ({ request }) => {
        return this.productsService.getProducts({
          page: request.page * 9,
        });
      },
    });
}
