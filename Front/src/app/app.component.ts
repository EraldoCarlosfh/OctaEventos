import { Component } from '@angular/core';
import { User } from './models/Identity/User';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title!: string;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.title = 'OctaEventos';
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    let user: User;

    if (localStorage.getItem('token')) {
      user = JSON.parse(localStorage.getItem('token') ?? '{}');
    }
    else {
      user = localStorage.removeItem('token')!;   
    }

    if (user)
    this.authService.setCurrentUser(user);
  }
}
