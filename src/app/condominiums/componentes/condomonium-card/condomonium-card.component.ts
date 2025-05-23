import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Condominium } from '../../interfaces/condominium.interface';


@Component({
  selector: 'app-condominium-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './condomonium-card.component.html',
})
export class CondomoniumCardComponent {
  condominium = input.required<Condominium>();

  imageUrl = computed(() => {
    return `http://localhost:3000/api/files/product/`;
  });
}
