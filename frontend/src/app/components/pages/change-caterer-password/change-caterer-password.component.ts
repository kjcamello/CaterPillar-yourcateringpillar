import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserAuthService } from 'src/app/services/userauth.service';
import { FormsModule,FormControl, Validators,NgForm, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-change-caterer-password',
  templateUrl: './change-caterer-password.component.html',
  styleUrls: ['./change-caterer-password.component.css'],
})
export class ChangeCatererPasswordComponent {
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