import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-caterer-sign-up',
  templateUrl: './caterer-sign-up.component.html',
  styleUrls: ['./caterer-sign-up.component.css']
})
export class CatererSignUpComponent implements OnInit{
  
  catererBInfo: any = {
    catererEmail: '',
    catererPwd: '',
    catererCPassword: ''
  };
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  catererEmailDefault: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
 
  onSignUpCaterer(): void {
    if (!this.errorValidation()) {
      return;
    }

    this.authService.setEmail(this.catererBInfo.catererEmail);
    
    this.afAuth.createUserWithEmailAndPassword(
      this.catererBInfo.catererEmail,
      this.catererBInfo.catererPwd
    )
    .then(catererCredential => {
      const caterer = catererCredential.user;
      if (!caterer) {
        throw new Error('Caterer data unavailable');
      }

      // Send email verification to the newly registered caterer
      return caterer.sendEmailVerification().then(() => caterer);
    })
    .then(caterer => {
      const displayName = this.getDisplayNameFromEmail(this.catererBInfo.catererEmail);
      const dataToSave = {
        catererBasicInfo: {
          catererEmail: this.catererBInfo.catererEmail,
          catererDisplayName: displayName,
          catererEmailVerified: caterer.emailVerified,
          catererPhotoURL: caterer.photoURL || '', 
          catererUid: caterer.uid
        }
      };
      return this.firestore.collection('caterers').doc(caterer.uid).set(dataToSave);
    })
    .then(() => {
      console.log('Caterer data saved to Firestore and verification email sent');
      this.router.navigate(['catering-information']);
    })
    .catch(error => {
      alert("Error:" + error.message);
      console.error("Error:", error.message);
    });
  }
  
  private getDisplayNameFromEmail(email: string): string {
    return email.split('@')[0];
  }

  private errorValidation(): boolean {
    if (!this.catererBInfo.catererEmail || !this.catererBInfo.catererPwd || !this.catererBInfo.catererCPassword) {
      alert('Please fill all the fields.');
      return false;
    }

    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/; 
    if (!emailPattern.test(this.catererBInfo.catererEmail)) {
      alert('Invalid email format.');
      return false;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 
    if (!passwordPattern.test(this.catererBInfo.catererPwd)) {
      alert('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
      return false;
    }

    if (this.catererBInfo.catererPwd !== this.catererBInfo.catererCPassword) {
      alert('Password and Confirm Password do not match.');
      return false;
    }

    return true; // If all validations pass
  }
  
}
