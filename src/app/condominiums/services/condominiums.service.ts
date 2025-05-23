import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';

import { catchError, delay, Observable, of, pipe, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Condominium, CondominiumResponse } from '../interfaces/condominium.interface';
import { ToastrService } from 'ngx-toastr';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  page?: number;
  
}

const emptyCondominium: Condominium = {
  _id: 'new',
  name: '',
  description: '',
  street: '',
  streetNumber: '',
  neighborhood: '',
  city: '',
  state: '',
  amenities: [],
  country: '',
  zipCode: '',
  latitude: '',
  longitude: '',
  status: 'ACTIVE',
  adminId: '',
  phone: '',
  email: '',
  website: '',
  image: ''
};

@Injectable({ providedIn: 'root' })
export class CondominiumsService {
  private http = inject(HttpClient);

  private condominiumsCache = new Map<string, CondominiumResponse>();
  private condominiumCache = new Map<string, Condominium>();

  constructor ( private  toastr : ToastrService )  { }

  getCondominiums(options: Options): Observable<CondominiumResponse> {
    const { limit = 10, page = 1 } = options;

    const key = `${limit}-${page}`; // 9-0-''
    if (this.condominiumsCache.has(key)) {
      return of(this.condominiumsCache.get(key)!);
    }

    return this.http
      .get<CondominiumResponse>(`${baseUrl}/condominiums`, {
        params: {
          limit,
          page:1,         
        },
      })
      .pipe(       
        tap((resp) => this.condominiumsCache.set(key, resp))
      );
  }

  getCondominiumByIdSlug(idSlug: string): Observable<Condominium> {
    if (this.condominiumCache.has(idSlug)) {
      return of(this.condominiumCache.get(idSlug)!);
    }

    return this.http
      .get<Condominium>(`${baseUrl}/condominiums/${idSlug}`)
      .pipe(tap((condominium) => this.condominiumCache.set(idSlug, condominium)));
  }

  getCondominiumId(id: string): Observable<Condominium> {
    if (id === 'new') {
      return of(emptyCondominium);
    }

    if (this.condominiumCache.has(id)) {
      return of(this.condominiumCache.get(id)!);
    }

    return this.http
      .get<Condominium>(`${baseUrl}/condominiums/${id}`)
      .pipe(tap((condominium) => this.condominiumCache.set(id, condominium)));
  }

  updateProduct(
    id: string,
    condominiumLike: Partial<Condominium>
  ): Observable<Condominium> {
    // Eliminar propiedades no deseadas
  
  
  
    
    const { _id, createdBy,updatedBy,createdAt,updatedAt, __v,...rest  } = condominiumLike as any;

    return this.http
      .patch<Condominium>(`${baseUrl}/condominiums/${id}`, rest)
      .pipe(
        tap((item) => {
          this.updateCondominiumCache(item)
          this.toastr.success('Estatus actualizado', 'Info');          
        }),        
        catchError((error) => {          
          this.toastr.warning(error.error.message, 'Error');
          return of(error);
        })
        
      );
  }



  createCondominium(condominiumLike: Partial<Condominium>): Observable<Condominium> {
    return this.http
      .post<Condominium>(`${baseUrl}/condominiums`, condominiumLike)
      .pipe(
        tap((condominium) => this.updateCondominiumCache(condominium))
      );
  }

  updateCondominiumCache(condominium: Condominium) {
    const id = condominium._id;

    this.condominiumCache.set(id, condominium);

    this.condominiumsCache.forEach((condominiumResponse) => {
      condominiumResponse.data = condominiumResponse.data.map(
        (currentCondominium) =>
          currentCondominium._id === id ? condominium : currentCondominium
      );
    });

    console.log('Caché actualizado');
  }
}
