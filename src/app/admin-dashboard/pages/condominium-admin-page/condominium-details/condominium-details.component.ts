import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@utils/form-utils';
import { firstValueFrom, last } from 'rxjs';
import { Condominium } from 'src/app/condominiums/interfaces/condominium.interface';
import { CondominiumsService } from 'src/app/condominiums/services/condominiums.service';

@Component({
  selector: 'condominium-details',
  imports: [ReactiveFormsModule,
    RouterModule,
    FormErrorLabelComponent,],
  templateUrl: './condominium-details.component.html',
})
export class CondominiumDetailsComponent implements OnInit {
  condominium = input.required<Condominium>();

  router = inject(Router);
  fb = inject(FormBuilder);

  condominiumService = inject(CondominiumsService);
  wasSaved = signal(false);

  condominiumForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    streetNumber:['',],

    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    neighborhood: ['', Validators.required],
    zipCode: ['', Validators.required],
    country: ['', Validators.required],

    latitude: ['',],
    longitude: ['',],
    status: ['',],
    amenities: ['',],
    image: ['',],
    phone: ['',],
    email: ['',],
    website: ['',],
    totalFloors:  ['',],
    totalApartments:  ['',],
    totalParkingSpaces: ['',],
    totalStorageSpaces:  ['',],
    totalCommonAreas:  ['',],

  });
  amenities: any;

  

  ngOnInit(): void {  
    this.setFormValue(this.condominium());
  }

  setFormValue(formLike: Partial<Condominium>) {
    this.condominiumForm.reset(this.condominium() as any);
     this.condominiumForm.patchValue(formLike as any);
  }

  onSizeClicked(size: string) {
  }

  async onSubmit() {
    const isValid = this.condominiumForm.valid;
    this.condominiumForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.condominiumForm.value;
   

    if(typeof formValue.amenities === 'string' && formValue.amenities.length > 0){
      this.amenities = formValue.amenities?.toLowerCase()
      .split(',')
      .map((item) => item.trim()) ?? [];
    }

    const productLike: Partial<Condominium> = {
      ...(formValue as any),
      amenities: this.amenities,
      adminId:'681286b78fb9f61f921d023d'
    };

    if (this.condominium()._id === 'new') {
      // Crear producto
      console.log('Creating product', productLike);
      const product = await firstValueFrom(
        this.condominiumService.createCondominium(productLike)
      );
     

      this.router.navigate(['/admin/condominiums', product._id]);
    } else {
     // console.log('Updating product', productLike);
      await firstValueFrom(
        this.condominiumService.updateProduct(this.condominium()._id, productLike)
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
}
