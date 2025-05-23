import { Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CondominiumsService } from 'src/app/condominiums/services/condominiums.service';
import { CondominiumDetailsComponent } from "./condominium-details/condominium-details.component";

@Component({
  selector: 'app-condominium-admin-page',
  imports: [CondominiumDetailsComponent],
  templateUrl: './condominium-admin-page.component.html',
})
export class CondominiumAdminPageComponent { 
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  condominiumService = inject(CondominiumsService);

  condominiumId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  condominiumResource = rxResource({
    request: () => ({ id: this.condominiumId() }),
    loader: ({ request }) => {

      //console.log(request.id)
      return this.condominiumService.getCondominiumId(request.id);
    },
  });

  

  redirectEffect = effect(() => {
    if (this.condominiumResource.error()) {
      this.router.navigate(['/admin/condominiums']);
    }
  });
}
