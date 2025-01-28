import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/users/login/login.component';
import { UserService } from './services/user.service';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { User } from './models/user';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WildHaven';

  url = GLOBAL.urlUploads + 'users/';
  
  public user: User;
  private readonly platformId = inject(PLATFORM_ID);
  
  constructor(private _userService: UserService, private router: Router, private cdr: ChangeDetectorRef) {
    this.user = new User("", "", "", "", "", "", "default-user.png", "")
    
  }

  ngOnInit() {
    
    
    if(isPlatformBrowser(this.platformId)){ console.log('browser'); }
    if(isPlatformServer(this.platformId)){ console.log('server'); }
    
    const storedIdentity = localStorage.getItem('Identity');
    if (storedIdentity) {
      this.user = JSON.parse(storedIdentity) as User;
      this.cdr.detectChanges(); // Forzar la actualización de la vista
    }
  }



  onLogout() {
    this._userService.logout();
    this.router.navigate(['/login']);  // Redirige a la página de login
  }

  isAuthenticated(): boolean {
    return this._userService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this._userService.isAdmin();
  }
}
