import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null') as User | null
  );
  private _token      = signal<string | null>(localStorage.getItem('token'));
  private _refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));

  private http = inject(HttpClient);

  constructor ( private  toastr : ToastrService )  { }

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  // valida el estado de la autenticacion
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });


  // retorna el usuario
  user = computed(() => this._user());

  token = computed(this._token);
  
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);


  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token) {
      this.logout();
      return of(false);
    }

    // Decodificar el token para verificar la fecha de expiración
    const isTokenValid = this.isTokenValid(token);
    const isRefreshTokenValid = this.isTokenValid(refreshToken!);

    if (!isRefreshTokenValid) {
      this.logout();
      return of(false);
    }

    if (isTokenValid) {
      this._authStatus.set('authenticated');
      return of(true);
    }


    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/refresh-token`, {
        "refreshToken": refreshToken,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout() {    
    this._user.set(null);
    this._token.set(null);
    this._refreshToken.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private handleAuthSuccess({ accessToken,refreshToken, email, fullName ,isActive,roles,_id, isEmailVerified}: AuthResponse) {
    
    if(_id){
      const user: User = {
        _id,
        email,
        fullName,
        isActive,
        isEmailVerified,
        roles,
      };
      this._user.set(user);
    }
    
    this._authStatus.set('authenticated');
    this._token.set(accessToken);
    this._refreshToken.set(refreshToken);

    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(this._user()));

    return true;
  }

  private handleAuthError(error: any) {
    console.log('Error en la autenticación:', error);
    if(error ) {
      const statusCode = error.status?.toString() || '';  
      const errorMessage = error.error?.message || 'Error desconocido';    
      if (statusCode.startsWith('40')) {
        this.toastr.warning(errorMessage, 'Error');
      }
      if (error.status === 0) {
        this.toastr.error( 'Error de conectividad' , 'Error' ) ;    
      }
      
    }


    
    this.logout();
    return of(false);
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      return decoded.exp > currentTime; // El token es válido si no ha expirado
    } catch (error) {
      return false; // Si no se puede decodificar, el token no es válido
    }
  }
}
