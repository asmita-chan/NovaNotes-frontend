import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('accessToken');
  let modifiedReq = req;

  const isAuthApi = req.url.includes("/login") || req.url.includes("/register") || req.url.includes("/auth");

  if(token && !isAuthApi){
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  return next(modifiedReq).pipe(
    catchError((error) => {
      if(error.status === 401){
        sessionStorage.clear();
        router.navigate(['']);
      }
      throw error;
    })
  );
};
