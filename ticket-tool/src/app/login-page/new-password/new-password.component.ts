import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CognitoService } from '../../cognito.service';
import { Router } from '@angular/router';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css',
})
export class NewPasswordComponent {
  private _newPassword: string;
  private _confirmNewPassword: string;
  private _passwordsDontMatch: boolean;
  private _messageError: string;
  public email: string;

  constructor(private cognito: CognitoService, private router: Router) {
    this._newPassword = '';
    this._confirmNewPassword = '';
    this._passwordsDontMatch = false;
    this._messageError = '';
    this.email =
      this.router.getCurrentNavigation()?.extras.state?.['email'] ?? '';
    //console.log('EMAIL', this.email);
  }

  public set newPassword(password: string) {
    this._newPassword = password;
  }

  public set confirmNewPassword(password: string) {
    this._confirmNewPassword = password;
  }

  public get passwordsDontMatch(): boolean {
    return this._passwordsDontMatch;
  }

  public get messageError(): string {
    return this._messageError;
  }

  public clearFields() {
    if (this._passwordsDontMatch) {
      this._passwordsDontMatch = false;
    }
  }

  public confirmPassword() {
    //console.log(this._newPassword, this._confirmNewPassword);
    if (this.passwordMatch()) {
      if (this.fieldsEmpty()) {
        this._messageError = 'I campi non possono essere vuoti';
        this._passwordsDontMatch = true;
      } else {
        this.callCognito();
      }
    } else {
      this._messageError = 'Le password non coincidono';
      this._passwordsDontMatch = true;
    }
  }

  public passwordMatch() {
    if (this._confirmNewPassword == this._newPassword) {
      return true;
    } else {
      return false;
    }
  }

  public fieldsEmpty() {
    if (this._confirmNewPassword == '' || this._newPassword == '') {
      this._messageError = 'I campi non possono essere vuoti';
      return true;
    } else {
      return false;
    }
  }

  public callCognito() {
    let confirmPasswordObj = {
      challengeResponse: this._newPassword,
    };
    this.cognito.confirmSignIn(confirmPasswordObj).then((data) => {
      try {
        let responseObj = Object.getOwnPropertyDescriptors(data);
        let responseObjName = responseObj['name']['value'];
        let responseObjMessage = responseObj['message']['value'];
        if (responseObjName == 'InvalidPasswordException') {
          this._messageError = responseObjMessage;
          this._passwordsDontMatch = true;
        }
      } catch (error) {
        console.log(error);
        try {
          let signedInObj = Object.getOwnPropertyDescriptors(data);
          let isSignedIn = signedInObj['isSignedIn']
          if(isSignedIn){
            this.router.navigate(['/dashboard']);
          }
        } catch (error) {}
      }
    });
  }
}
