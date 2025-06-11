import { Component } from '@angular/core';
import { CognitoService } from '../cognito.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription, take, tap } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private _email: string;
  private _password: string;
  private _errorMessage: string;
  private _isThereAnError: boolean;
  private _isLoggedIn: boolean;
  private authSubscription: Subscription | undefined;

  constructor(private cognito: CognitoService, private router: Router) {
    this._isLoggedIn = false;

    this._email = '';
    this._password = '';
    this._errorMessage = '';
    this._isThereAnError = false;
  }

  public set password(password: string) {
    this._password = password;
  }

  public set email(email: string) {
    this._email = email;
  }

  public get errorMessage(): string {
    return this._errorMessage;
  }

  public get isThereAnError(): boolean {
    return this._isThereAnError;
  }

  public ngOnInit() {
    this.cognito.currentAuthenticatedUser().then(
      (isLoggedIn)=>{
        if(isLoggedIn != 'UserUnAuthenticatedException'){
          this.router.navigate(['/dashboard']);
        }
      }
    )
  }

  public clearFields() {
    if (this._isThereAnError == true) {
      this._isThereAnError = false;
    }
  }

  public ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  public login() {
    //console.log(this._email, this._password);
    let loginobj = { username: this._email, password: this._password };
    this.cognito.handleSignIn(loginobj).then((data) => {
      let dataDescriptors = Object.getOwnPropertyDescriptors(data);
      try {
        let errorName = dataDescriptors['name']['value'];
        let errorMessage = dataDescriptors['message']['value'];
        this._errorMessage = errorMessage;
        if (errorName == 'UserNotFoundException' || 'NotAuthorizedException') {
          this._isThereAnError = true;
        }
      } catch (error) {
        console.log(error);
      }
      //console.log(dataDescriptors);
      if (data == 'NEW PASSWORD REQUIRED') {
        this.router.navigate(['/login/new-password'], {
          state: { email: this._email },
        });
      }
      //console.log("DATA ON LOGIN PAGE",data);
      if (data == 'DONE') {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
