import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/users/login/login.component';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WildHaven';

  constructor(private _userService: UserService, private router: Router) {}
  onLogout() {
    this._userService.logout();
    this.router.navigate(['/login']);  // Redirige a la página de login
  }

  isAuthenticated(): boolean {
    return this._userService.isAuthenticated();
  }
}
