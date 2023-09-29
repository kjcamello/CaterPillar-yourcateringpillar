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
    if (this.catererBInfo.catererPwd !== this.catererBInfo.catererCPassword) {
      console.error('Passwords do not match');
      return;
    }
    this.authService.setEmail(this.catererBInfo.catererEmail);
    // Sign up using Firebase authentication
    this.afAuth.createUserWithEmailAndPassword(
      this.catererBInfo.catererEmail,
      this.catererBInfo.catererPwd
    )
    .then(catererCredential => {
      const caterer = catererCredential.user;
      if (!caterer) {
        throw new Error('Caterer data unavailable');
      }
      
      
      
      // Sending email verification to the newly registered caterer
      return caterer.sendEmailVerification().then(() => caterer);
    })
    .then(caterer => {
      // Extract display name from the email
      const displayName = this.getDisplayNameFromEmail(this.catererBInfo.catererEmail);
      
      // Create data structure for Firestore
      const dataToSave = {
        catererBasicInfo: {
          catererEmail: this.catererBInfo.catererEmail,
          catererDisplayName: displayName,
          catererEmailVerified: caterer.emailVerified,
          catererPhotoURL: caterer.photoURL || '', 
          catererUid: caterer.uid
        }
      };
      // this.authService.setEmail(this.catererBInfo.catererEmail);
      // this.catererEmailDefault = this.catererBInfo.catererEmail;
      // Save to Firestore under the caterers collection with caterer's UID as the document ID
      return this.firestore.collection('caterers').doc(caterer.uid).set(dataToSave);
    })
    .then(() => {
      console.log('Caterer data saved to Firestore and verification email sent');
      
      // this.router.navigate(['catering-information'], { queryParams: { catererDefaultEmail: this.catererBInfo.catererEmail} });
      this.router.navigate(['catering-information']);
    })
    .catch(error => {
      console.error("Error:", error.message);
    });
  }
  
  private getDisplayNameFromEmail(email: string): string {
    return email.split('@')[0];
  }

  private getEmail(email: string): string {
    email = this.catererBInfo.catererEmail;
    
    return email;
  }
  
}
