import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IUser, CognitoService } from '../cognito.service';
// import { CognitoUser } from '@aws-amplify/auth';
import { environment } from 'src/environments/environment';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  loading: boolean;
  user: IUser;
  cognitoUser!: CognitoUser;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService
      .signIn(this.user)
      .then((resp) => {
        this.cognitoUser = resp;
        this.loading = false;
      })
      .catch(() => {});
      this.loading =false
  }

  send() {
    this.cognitoService
      .sendCustomChallenge(this.cognitoUser, this.user.code)
      .then((resp) => {
        console.log(resp);
      })
      .catch();
  }
}
