import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.css']
})
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
  }
}