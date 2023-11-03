import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CatererSignUpComponent } from '../caterer-sign-up/caterer-sign-up.component';

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


  constructor(private afAuth: AngularFireAuth, private router: Router, private authService: AuthService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
      
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async onSignInCaterer() {
    if (!this.catererBInfo.catererEmail || !this.catererBInfo.catererPwd) {
        return alert('Please enter your email and password.');
    }

    this.authService.setEmail(this.catererBInfo.catererEmail);

    try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(
            this.catererBInfo.catererEmail,
            this.catererBInfo.catererPwd
        );
        const uid = userCredential.user?.uid;

        if (!uid) {
            throw new Error('UID not available.');
        }

        const isCaterer = await this.checkIfUserIsCaterer(uid);
        if (isCaterer) {
            console.log('User logged in successfully');
            return this.router.navigate(['/dashboard-caterer']);
        }

        const isCustomer = await this.checkIfUserIsCustomer(uid);
        if (isCustomer) {
            await this.convertCustomerToCaterer(uid);
            return this.router.navigate(['/catering-information']);
            // return this.router.navigate(['/dashboard']);
        }

        console.error('Authentication failed: User data not found in Firestore.');
        alert('Authentication failed. Please contact support.');
        this.afAuth.signOut();

    } catch (error) {
        console.error('Error during sign-in:', error);
        alert('Login failed: ' + error.message);
    }
}

async checkIfUserIsCaterer(uid: string) {
    const docSnapshot = await this.firestore.doc(`caterers/${uid}`).get().toPromise();
    return docSnapshot.exists;
}

async checkIfUserIsCustomer(uid: string) {
    const docSnapshot = await this.firestore.doc(`customers/${uid}`).get().toPromise();
    return docSnapshot.exists;
}

async convertCustomerToCaterer(uid: string) {
    const displayName = this.getDisplayNameFromEmail(this.catererBInfo.catererEmail);
    const catererCredential = await this.afAuth.signInWithEmailAndPassword(
        this.catererBInfo.catererEmail,
        this.catererBInfo.catererPwd
    );
    const caterer = catererCredential.user;

    const dataToSave = {
        catererBasicInfo: {
            catererEmail: this.catererBInfo.catererEmail,
            catererDisplayName: displayName,
            catererEmailVerified: caterer.emailVerified,
            catererPhotoURL: caterer.photoURL || '',
            catererUid: caterer.uid
        }
    };

    await this.firestore.collection('caterers').doc(caterer.uid).set(dataToSave);
    console.log('Caterer data saved to Firestore and verification email sent');

    alert('You\'re currently signed up as a customer. Click ok to sign up as Caterer.');
}

private getDisplayNameFromEmail(email: string): string {
  return email.split('@')[0];
}
}
