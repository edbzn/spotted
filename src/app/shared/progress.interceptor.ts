import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { ProgressBarService } from '../core/services/progress-bar.service';
import { tap } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';

export class ProgressInterceptor implements HttpInterceptor {
  constructor(private progressBarService: ProgressBarService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.progressBarService.increase();

    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            this.progressBarService.decrease();
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            this.progressBarService.decrease();
          }
        }
      )
    );
  }
}
