import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserAuthService } from 'src/app/services/userauth.service';
import { FormsModule,FormControl, Validators,NgForm, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.css'],
})
export class ChangeUserPasswordComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  email: string | null = null; // Initialize email as null
  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/; // Password regex

  constructor(
    private userAuthService: UserAuthService,
    private afAuth: AngularFireAuth
  ) {
    // Subscribe to the auth state changes to get the user's email
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.email = user.email;
      }
    });
  }

  async changePassword() {
    try {
      // Check if the new password and confirm password match
      if (this.newPassword !== this.confirmPassword) {
        window.alert('New password and confirm password do not match.');
        return;
      }

      // Check if the new password meets complexity requirements
      if (!this.passwordRegex.test(this.newPassword)) {
        window.alert(
          'New password must be at least 6 characters and contain 1 lowercase, 1 uppercase, and 1 special symbol.'
        );
        return;
      }

      if (!this.email) {
        window.alert('Email address not available.');
        return;
      }

      // Reauthenticate the user with their old password
      await this.userAuthService.reauthenticateUser(this.email, this.oldPassword);

      // Change the user's password to the new password
      await this.userAuthService.changePassword(this.newPassword);

      window.alert('Password updated successfully.');
      
    } catch (error) {
      console.error('Error changing password:', error);
      window.alert('Invalid old password.');
    }
  }
}


/*import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserAuthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.css'],
})
export class ChangeUserPasswordComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private userAuthService: UserAuthService,
    private afAuth: AngularFireAuth
  ) {}

  async changePassword() {
    try {
      // Check if the new password and confirm password match
      if (this.newPassword !== this.confirmPassword) {
        window.alert('New password and confirm password do not match.');
        return;
      }

      // Assuming you have the 'email' value available in your component
      const email = 'ninopatricklopez@gmail.com'; // Replace with the actual email value

      // Reauthenticate the user with their old password
      await this.userAuthService.reauthenticateUser(email, this.oldPassword);

      // Change the user's password to the new password
      await this.userAuthService.changePassword(this.newPassword);

      window.alert('Password updated successfully.');
    } catch (error) {
      console.error('Error changing password:', error);
      window.alert('An error occurred while changing the password.');
    }
  }
}
*/


/*import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/services/userauth.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule,FormControl, Validators,NgForm, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.css']
})

export class ChangeUserPasswordComponent implements OnInit{
  email : string = ' ';
  constructor (
    public userAuthService: UserAuthService
    ) { }

  ngOnInit(){}

export class ChangeUserPasswordComponent {
  oldPassword = '';
  newPassword = '';
  sConfirmPassword = '';
  doesPasswordsNotMatch = false;
  passwordChanged = false;

  form = new FormGroup({
    old_password: new FormControl('', [Validators.required]),
    new_password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required])
  });

  // Initialize the password input types
  oldPasswordType: 'password' | 'text' = 'password';
  newPasswordType: 'password' | 'text' = 'password';
  confirmPasswordType: 'password' | 'text' = 'password';

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  async changePassword() {
    const user = await this.afAuth.currentUser;

    if (this.newPassword === this.sConfirmPassword) {
      try {
        await user.updatePassword(this.newPassword);

        // Update the user's password in the database if necessary
        const userId = user.uid;
        const userRef = this.db.object(`/users/${userId}`);
        userRef.update({ password: this.newPassword });

        // Password changed successfully, set the flag and navigate to the dashboard
        this.passwordChanged = true;
        this.router.navigate(['/dashboard']); // Replace '/dashboard' with your actual dashboard route
      } catch (error) {
        console.error('Error updating password:', error);
      }
    } else {
      this.doesPasswordsNotMatch = true;
    }
  }

  // Method to toggle password visibility
  togglePassword(fieldName: string) {
    switch (fieldName) {
      case 'oldPassword':
        this.oldPasswordType = this.oldPasswordType === 'password' ? 'text' : 'password';
        break;
      case 'newPassword':
        this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password';
        break;
      case 'confirmPassword':
        this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
        break;
    }
}*/