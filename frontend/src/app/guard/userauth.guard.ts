import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';

import { Observable } from 'rxjs';
import { UserAuthService } from '../services/userauth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(public UserAuthService: UserAuthService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    if (this.UserAuthService.isLoggedIn !== true) {
      this.router.navigate(['login']);
    }
    return true;
  }
}