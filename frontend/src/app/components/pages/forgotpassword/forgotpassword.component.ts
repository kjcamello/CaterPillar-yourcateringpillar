import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/services/userauth.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})

  export class ForgotPasswordComponent {
    userEmail: string = ''; // Variable to store user's email
    isSubmitted = false;
  
    constructor(
      private userauthService: UserAuthService,
      private toastrService: ToastrService
    ) {}
  
    sendPasswordResetEmail() {
      this.isSubmitted = true;
  
      if (!this.userEmail) {
        this.toastrService.error('Please enter your email address.');
        return;
      }
  
      // Call your userauthService's ForgotPassword method with userEmail
      this.userauthService.ForgotPassword(this.userEmail).then(
        () => {
          this.toastrService.success('Password reset email sent to your inbox. Please check your email.');
        },
        (error) => {
          this.toastrService.error('Failed to send reset email. Please try again.');
          console.error('Error sending reset email:', error);
        }
      );
    }
  }
 
  
  


