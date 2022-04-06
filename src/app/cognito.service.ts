import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Amplify, Auth } from 'aws-amplify';

import { environment } from '../environments/environment';
import { CognitoUser } from '@aws-amplify/auth';

export interface IUser {
  email: string;
  phoneNumber:string,
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(user: IUser): Promise<any> {
    const phoneNumber = "+91" + user.phoneNumber;
    return Auth.signUp({
      username: phoneNumber,
      password: "qwertyuiop",
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp("+917907643326", user.code);
  }


  public sendCustomChallenge(user: CognitoUser | any, challengeResponses: string):Promise<any>{
    return Auth.sendCustomChallengeAnswer(user,challengeResponses)
  }

  public signIn(user: IUser): Promise<any> {
    const phoneNumber = "+91" + user.phoneNumber;
    return Auth.signIn(phoneNumber)
    .then((user) => {
      this.authenticationSubject.next(true);
      return user;
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut()
    .then(() => {
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
      .then((user: any) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
    }
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
    .then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }

}
