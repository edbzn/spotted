import { AngularFireAuth } from 'angularfire2/auth';
import { CanActivate } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private fireAuth: AngularFireAuth) {}

  canActivate(): Observable<boolean> {
    return this.fireAuth.user.pipe(
      map(auth => {
        if (!auth) {
          this.auth.logout('/user/login');

          return false;
        }

        return true;
      })
    );
  }
}
