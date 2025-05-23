import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnDestroy  {

  constructor ( private  toastr : ToastrService )  { }
  
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

 
  isPosting = signal(false);
  
  suscription: Subscription = new Subscription();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.error( 'Campos invalidos, favor de revisar' , 'Error' ) ;    
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;

    this.suscription = this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/');
        return;
      }        
    });
  }


  ngOnDestroy(): void {
    if (this.suscription ) {
      this.suscription.unsubscribe(); // Cancelar la suscripción si existe
    }
    
  }

  // Check Authentication

  // Registro

  // Logout
}
