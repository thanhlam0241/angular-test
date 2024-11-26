import { Component, VERSION, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { AuthenticateService } from '@app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [CommonModule],
})
export class NavbarComponent implements OnInit {
  version = VERSION.full;
  user!: User;
  isLoggedIn = false;

  constructor(
    private readonly router: Router,
    private readonly _authenticateService: AuthenticateService
  ) {}

  ngOnInit() {
    this._authenticateService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  logIn() {
    // TODO: Please replace with a service call
    this._authenticateService.login();
    this.router.navigate(['/pokemons']);
  }

  logOut() {
    // TODO: Please replace with a service call
    this._authenticateService.logout();
    this.router.navigate(['/not-auth']);
  }
}
