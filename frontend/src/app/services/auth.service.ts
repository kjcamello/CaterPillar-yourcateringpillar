import { Injectable, NgZone } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { Caterer } from 'src/app/shared/models/caterer';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  catererData: any;
  constructor(
    public db: AngularFireDatabase,  // Adjusted to use AngularFireDatabase
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    // this.afAuth.authState.subscribe((user) => {
    //   if (user) {
    //     this.userData = user;
    //     localStorage.setItem('user', JSON.stringify(this.userData));
    //     JSON.parse(localStorage.getItem('user')!);
    //   } else {
    //     localStorage.setItem('user', 'null');
    //     JSON.parse(localStorage.getItem('user')!);
    //   }
    // });
    this.afAuth.authState.subscribe((caterer) => {
      if (caterer) {
        this.catererData = caterer;
        localStorage.setItem('caterer', JSON.stringify(this.catererData));
        JSON.parse(localStorage.getItem('caterer')!);
      } else {
        localStorage.setItem('caterer', 'null');
        JSON.parse(localStorage.getItem('caterer')!);
      }
    });
   }
   // Sign in with email/password
  // SignIn(email: string, password: string) {
  //   return this.afAuth
  //     .signInWithEmailAndPassword(email, password)
  //     .then((result) => {
  //       this.SetUserData(result.user);
  //       this.afAuth.authState.subscribe((user) => {
  //         if (user) {
  //           this.router.navigate(['dashboard']);
  //         }
  //       });
  //     })
  //     .catch((error) => {
  //       window.alert(error.message);
  //     });
  // }

  SignInCaterer(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserDataCaterer(result.user);
        this.afAuth.authState.subscribe((caterer) => {
          if (caterer) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  SignUpCaterer(email: string, password: string) {
    // , businessName: string, contactNumber: string, businessAddress: string
    // cpassword: string

    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        
        this.SendVerificationMail();
        this.CateringInformation();
        this.SetUserDataCaterer(result.user); 
        // , businessName, contactNumber, businessAddress
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Send email verfificaiton when new user sign up
  CateringInformation(){
    return this.afAuth.currentUser
      // .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['catering-information']);
      });
      // .then(() => {
      //   alert('Email verification has been sent to your email address. Please check your inbox.');
      // })
      // .catch((error) => {
      //   alert('Error sending email verification: ' + error.message);
      // });
  }

  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      // .then(() => {
      //   this.router.navigate(['verify-email-address']);
      // });
      .then(() => {
        alert('Email verification has been sent to your email address. Please check your inbox.');
      })
      .catch((error) => {
        alert('Error sending email verification: ' + error.message);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  get CatererisLoggedIn(): boolean {
    const caterer = JSON.parse(localStorage.getItem('caterer')!);
    return caterer !== null && caterer.emailVerified !== false ? true : false;
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserDataCaterer(caterer: any) {
    // , businessName?: string, contactNumber?: string, businessAddress?: string
    const catererRef: AngularFirestoreDocument<any> = this.afs.doc(`caterer/${caterer.uid}`);
    let catererData: Caterer = {
      catererUid: caterer.uid,
      catererEmail: caterer.email,
      catererDisplayName: caterer.displayName,
      catererPhotoURL: caterer.photoURL,
      catererEmailVerified: caterer.emailVerified
    };


    // if (businessName) {
    //   catererData.catererBusinessName = businessName;
    // }

    // if (contactNumber) {
    //   catererData.catererContactNumber = contactNumber;
    // }

    // if (businessAddress) {
    //   catererData.catererBusinessAddress = businessAddress;
    // }

    // Saving to Firestore
    catererRef.set(catererData, { merge: true })
    .then(() => console.log("Saved to Firestore"))
    .catch(error => console.error("Error saving to Firestore:", error));

    // Saving to Realtime Database
    // this.db.object(`caterer/${caterer.uid}`).set(catererData)
    // .then(() => console.log("Saved to Realtime Database"))
    // .catch(error => console.error("Error saving to Realtime Database:", error));

  }
  // Sign out
  SignOutCaterer(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('caterer');
      this.router.navigate(['sign-in']);
    });
  }

  saveCateringData(catererUid: string, cateringInfo: any, catererInfo: any): Promise<void> {
    const catererRef: AngularFirestoreDocument<any> = this.afs.doc(`catererInfo/${catererUid}`);
    const combinedData = {
      cateringInfo,
      catererInfo
    };

    return catererRef.set(combinedData, { merge: true });
  }

  getCatererUid(): string | null {
    return this.catererData ? this.catererData.uid : null;
}
  
}
