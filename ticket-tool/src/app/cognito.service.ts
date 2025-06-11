import { Injectable } from '@angular/core';
import { signIn, type SignInInput } from 'aws-amplify/auth';
import { confirmSignIn, type ConfirmSignInInput } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { group } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private _isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isLoggedIn$: Observable<boolean> = this._isLoggedIn$.asObservable();
  private groups: string[] = []

  constructor() {}

  async currentSession() {
    try {
      //Ottengo token
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      let accessTokenExp = accessToken?.payload.exp;
      let idTokenExp = idToken?.payload.exp;
      console.log("TOKENS=", accessToken, idToken);
      let currentDate = Date.now()/1000;
      //Confronto date scadenza token e se scaduti butto fuori
      console.log("Current Date=", currentDate, "ACCESS TOKEN EXP DATE=", accessTokenExp);
      if (accessTokenExp != undefined && currentDate > accessTokenExp){
        await signOut();
        this._isLoggedIn$.next(false);
        alert("Sessione Scaduta");
      }
      if (idTokenExp != undefined && currentDate > idTokenExp){
        await signOut();
        this._isLoggedIn$.next(false);
        alert("Sessione Scaduta");
      }
      
      console.log("Current Date=", currentDate, "ACCESS TOKEN EXP DATE=", idTokenExp);

      return {accessToken, idToken}
    } catch (err) {

      // Esegui logout quando fetchAuthSession fallisce (anche per Refresh Token scaduto)
      await signOut();
      this._isLoggedIn$.next(false);
      alert("Sessione Scaduta");

      console.log("CURRENT SESSION ERR=",err);
      const errorObj = Object.getOwnPropertyDescriptors(err);
      const errorName = errorObj['name']?.['value'];
      return errorName;
    }
  }

  async currentAuthenticatedUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      //console.log("CURRENT AUTHENTICATE USER=",username, userId, signInDetails)
      this._isLoggedIn$.next(true);
      return { username, userId, signInDetails };
    } catch (err) {
      const errorObj = Object.getOwnPropertyDescriptors(err);
      const errorName = errorObj['name']?.['value'];
      return errorName;
    }
  }

  async handleSignIn({ username, password }: SignInInput) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      //console.log(isSignedIn, nextStep);
      switch (nextStep.signInStep) {
        case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
          return 'NEW PASSWORD REQUIRED';
        case 'DONE':
          this._isLoggedIn$.next(true);
          return 'DONE';
        default:
          return isSignedIn;
      }
    } catch (error) {
      return error;
    }
  }

  async confirmSignIn({ challengeResponse, options }: ConfirmSignInInput) {
    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse,
        options,
      });

      return { isSignedIn, nextStep };
    } catch (error) {
      return error;
    }
  }

  async signOut() {
    await signOut();
    this._isLoggedIn$.next(false);
  }

  async getUserGroups(){
    
    await this.currentSession().then(
      (tokens)=>{
        console.log("GROUP TOKENS=",tokens);
        let idToken = tokens.idToken;
        let groups = idToken.payload['cognito:groups']
        this.groups = groups;
      }
    )
    return this.groups;
  }
}
