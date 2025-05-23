import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';

@Component({
  selector: 'pagination-row-per-page',
  imports: [],
  templateUrl: './pagination-row-per-page.component.html',
})
export class PaginationRowPerPageComponent {
   selectedItemsPerPage = input(10); // Valor inicial

   itemsPerPageChange = output<number>(); // Emisor de eventos para cambios

  onItemsPerPageChange($event:any): void {
    this.itemsPerPageChange.emit($event.target.value); // Emitir el nuevo valor
  }
  
 }
