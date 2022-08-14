import { Injectable } from '@angular/core';
import {
  AuthConfig,
  JwksValidationHandler,
  OAuthService,
} from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId:
    '246242729878-chlghfhc635p1059aecogpqreq41749t.apps.googleusercontent.com',
  scope: 'openid profile email',
};

@Injectable({
  providedIn: 'root',
})
export class OAuthLoginServiceService {
  constructor(private readonly oAuthService: OAuthService) {
    this.configureSingleSignOn();
  }

  configureSingleSignOn(): void {
    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login(): void {
    this.oAuthService.initLoginFlow();
  }

  logout(): void {
    this.oAuthService.logOut();
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  getUserName(): Observable<string> {
    let result: string = '';
    const keys = Object.keys(this.oAuthService.getIdentityClaims());
    const lastName = keys.find((key) => key === 'family_name');
    const givenName = keys.find((key) => key === 'given_name');
    if (lastName && givenName) {
      const lastNameValue = Object.values(
        this.oAuthService.getIdentityClaims()
      )[keys.indexOf(lastName)];
      const givenNameValue = Object.values(
        this.oAuthService.getIdentityClaims()
      )[keys.indexOf(givenName)];
      result = `${givenNameValue} ${lastNameValue}`;
    }
    return of(result);
  }
}
