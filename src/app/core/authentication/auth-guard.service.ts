import { AngularFireAuth } from 'angularfire2/auth';
import { Router, CanActivate } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.user.pipe(
      map(auth => {
        if (!auth) {
          this.router.navigateByUrl('/user/login');
          return false;
        }

        return true;
      })
    );
  }
}
