// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {
  constructor(private authService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      if(this.authService.isAdmin()){
        return true;
      }
      else{
        this.router.navigate(['/unauthorized'])
        return false;
      }
    } else {
      // Redirige al usuario a la página de login si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
}