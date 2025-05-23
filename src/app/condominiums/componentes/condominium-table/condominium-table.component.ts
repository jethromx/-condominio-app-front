import { Component, effect, inject, input, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Condominium } from '../../interfaces/condominium.interface';
import { CondominiumsService } from '../../services/condominiums.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-condominium-table',
  imports: [RouterLink],
  templateUrl: './condominium-table.component.html',
})
export class CondominiumTableComponent implements OnDestroy {

  condominiums = input.required<Condominium[]>();
  
  condominiumService = inject(CondominiumsService);

  private destroy$ = new Subject<void>(); // Subject para manejar el ciclo de vida


  onStatusChange(item: any, event: any): void {
   // const newStatus = isChecked ? 'ACTIVE' : 'INACTIVE';

   const htmlCheck = event as HTMLInputElement;
   
     // Simulación de actualización local
    const newStatus = htmlCheck.checked == true ? 'ACTIVE' : 'INACTIVE';
    item.status = newStatus;

    // Llamar al servicio y usar takeUntil para manejar la suscripción
    this.condominiumService
    .updateProduct(item._id, item)
    .pipe(takeUntil(this.destroy$))// La suscripción se completa automáticamente al destruir el componente
    .subscribe(() => {
       console.log('Estado actualizado correctamente');
     })

  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este condominio?')) {
     /* this.condominiumService.deleteCondominium(id).subscribe(() => {
        console.log(`Condominio con ID ${id} eliminado`);
        // Actualizar la lista local después de eliminar
        this.condominiums = this.condominiums.filter((item) => item._id !== id);
      });*/
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emitir un valor para completar las suscripciones
    this.destroy$.complete(); // Completar el Subject
  }
  
  
}
