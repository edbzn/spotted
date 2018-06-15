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
