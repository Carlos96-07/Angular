import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Evita ejecutar localStorage cuando está en SSR
  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) {
    console.warn('SSR mode: authGuard no puede validar localStorage');
    return false;
  }

  const sessionId = localStorage.getItem('sessionId');

  if (sessionId) {
    return true;
  }

  console.log('Usuario no autenticado, redirigiendo a login…');
  router.navigate(['/login']);
  return false;
};
