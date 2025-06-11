import { CanActivateFn, Router } from '@angular/router';
import { CognitoService } from './cognito.service';
import { inject } from '@angular/core';
import { firstValueFrom, take } from 'rxjs';
// Flag di stato per controllare se una navigazione è in corso
let isNavigating = false;

export const loginGuardGuard: CanActivateFn = async (route, state) => {
  const cognito = inject(CognitoService);
  const router = inject(Router);

  await cognito.currentSession();

  // Poi prendi il valore aggiornato
  const isLoggedInObj = await cognito.currentAuthenticatedUser();
  if (isLoggedInObj === 'UserUnAuthenticatedException'){
    router.navigate(['/login'])
    return false
  }
  console.log("LOGGED IN USER=", isLoggedInObj);
  return true
};
