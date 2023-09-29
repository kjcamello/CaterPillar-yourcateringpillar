import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {


  catererBInfo = {
    catererEmail: '',
    catererPwd: ''
  };

  passwordVisible = false;


  constructor(private afAuth: AngularFireAuth, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
      
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSignInCaterer() {
    if (this.catererBInfo.catererEmail && this.catererBInfo.catererPwd) {
      this.afAuth.signInWithEmailAndPassword(this.catererBInfo.catererEmail, this.catererBInfo.catererPwd)
        .then(() => {
          console.log('User logged in successfully');
          this.router.navigate(['/dashboard']); // Redirect to the dashboard or another appropriate route
        })
        .catch(error => {
          console.error('Error during sign-in:', error);
          alert('Login failed: ' + error.message);
        });
    } else {
      alert('Please enter your email and password.');
    }
  }
}
