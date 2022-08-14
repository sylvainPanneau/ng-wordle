import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OAuthLoginServiceService } from '../oauth-login-service.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(private authService: OAuthLoginServiceService) {}

  ngOnInit(): void {}

  oAuthLogin(): void {
    this.authService.login();
  }

  oAuthLogout(): void {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserName(): Observable<string> {
    return this.authService.getUserName();
  }
}
