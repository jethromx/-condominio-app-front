
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbarComponent } from '../../components/front-navbar/front-navbar.component';

@Component({
  selector: 'condominio-front-layout',
  imports: [RouterOutlet, FrontNavbarComponent],
  templateUrl: './condominio-front-layout.component.html',
})
export class CondominioFrontLayoutComponent {}
