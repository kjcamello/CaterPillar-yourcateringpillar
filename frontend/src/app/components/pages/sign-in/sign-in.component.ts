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
        // Check caterer status and show alert if necessary
        const catererStatus = await this.getCatererStatus(uid);
  
        if (catererStatus === 'Warned') {
          const remarks = await this.getCatererRemark(uid);
          alert(`Your account is in warning status.\nReason: ${remarks}. For status appeals, please send us an email at caterpillarservice@gmail.com. Thank you for catering with us.`);
          // Proceed with login
          return this.router.navigate(['/dashboard-caterer']);
        } else if (catererStatus === 'Disabled') {
          const remarks = await this.getCatererRemark(uid);
          alert(`Your account is disabled.\nReason: ${remarks}. For status appeals, please send us an email at caterpillarservice@gmail.com. Thank you for catering with us.`);
          // User should not be able to log in
          this.afAuth.signOut();
          return;
        }
  
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
async getCatererStatus(uid: string): Promise<string> {
    try {
      const catererDoc = await this.firestore.collection('caterers').doc(uid).get().toPromise();

      if (catererDoc.exists) {
        const catererData: any = catererDoc.data();
        return catererData?.status || '';
      } else {
        console.error('Caterer document does not exist.');
        return '';
      }
    } catch (error) {
      console.error('Error getting caterer status:', error);
      throw error;
    }
  }

  
  async getCatererRemark(uid: string): Promise<string> {
    try {
      const catererDoc = await this.firestore.collection('caterers').doc(uid).get().toPromise();

      if (catererDoc.exists) {
        const catererData: any = catererDoc.data();
        return catererData?.remarks || '';
      } else {
        console.error('Caterer document does not exist.');
        return '';
      }
    } catch (error) {
      console.error('Error getting caterer remark:', error);
      throw error;
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
