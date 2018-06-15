import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators';

export class TimingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const started = Date.now();
    return next.handle(req).pipe(
      tap(
        (response: HttpEvent<any>) => {
          if (response instanceof HttpResponse) {
            for (const key in response) {
              if (response.hasOwnProperty(key)) {
                const prop = response[key];
              }
            }
            const elapsed = Date.now() - started;
            console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            const elapsed = Date.now() - started;
            console.log(
              `Request for ${req.urlWithParams} failed after ${elapsed} ms.`
            );
          }
        }
      )
    );
  }
}
