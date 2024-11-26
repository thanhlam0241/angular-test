import { Injectable } from '@angular/core';
import { AuthenticateService } from '@app/services/auth.service';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
} from '@angular/router';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard
  implements CanLoad, CanActivate, CanActivateChild
{
  constructor(
    private readonly router: Router,
    private readonly _authenticateService: AuthenticateService
  ) {}

  canLoad() {
    return this.isAuth$();
  }

  canActivate() {
    return this.isAuth$();
  }

  canActivateChild() {
    return this.isAuth$();
  }

  private isAuth$() {
    const isAuth = this._authenticateService.isAuthenticated();
    return of(isAuth).pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/not-auth']);
        }
      })
    );
  }
}
