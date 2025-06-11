import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Amplify } from 'aws-amplify';
import { environment } from '../environments/environment.development';
import { CognitoService } from './cognito.service';
import { Subscription, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { group } from '@angular/animations';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolWebClientId,
    },
  },
});

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ticket-tool';
  private _isLoggedIn: boolean = false;
  private _isAdmin: boolean = false;
  private userGroups: string[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private cognito: CognitoService, private router: Router) {
    this.getUserGroups();
  }

  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  public get isAdmin(): boolean {
    return this._isAdmin;
  }

  ngOnInit() {
    this.cognito.currentAuthenticatedUser();
    this.subscription.add(
      this.cognito.isLoggedIn$.subscribe((isLoggedIn) => {
        console.log('App Component - Auth state changed:', isLoggedIn);
        this._isLoggedIn = isLoggedIn;
      })
    );
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public logOut() {
    this.cognito.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  public getUserGroups() {
    this.cognito.getUserGroups().then((groups) => {
      console.log('ON APP GROUPS=', groups);
      this.userGroups = groups;
      for (let i = 0; i <= this.userGroups.length; i++) {
        if (this.userGroups[i] == 'Admins') {
          this._isAdmin = true;
          console.log('IS ADMIN OK');
        } else {
          this._isAdmin = false;
        }
      }
    });
  }
}
