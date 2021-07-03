import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        const errMessage = error.error.message ? error.error.message : 'An error occured';
        this.dialog.open(ErrorComponent, {
          data: { message: errMessage }
        });
        // alert(error.error.message);
        return throwError(error);
      })
    );
  }
}
