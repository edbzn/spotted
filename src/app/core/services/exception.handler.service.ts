import * as Raven from 'raven-js';
import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from '../../authentication/auth.service';

@Injectable()
export class ExceptionHandler implements ErrorHandler {
  constructor(auth: AuthService) {
    const raven = Raven.config(environment.ravenDNS).install();

    raven.setEnvironment(
      environment.production === true ? 'production' : 'development'
    );

    if (auth.user) {
      const { user } = auth;

      raven.setUserContext({
        email: user.email,
        id: user.uid,
      });
    }
  }

  handleError(err: any): void {
    if (environment.production) {
      Raven.captureException(err.originalError || err);
    }

    console.error(err.originalError || err);
  }
}
