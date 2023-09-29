//userauthservices.ts
import { Injectable, NgZone } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as auth from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  userData: any; // Save logged in user data
  constructor(
    private toastr: ToastrService,
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private db: AngularFireDatabase
  ) 
  
  {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('customer', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('customer')!);
      } else {
        localStorage.setItem('customer', 'null');
        JSON.parse(localStorage.getItem('customer')!);
      }
    });
   }
   // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Sign up with email/password
  signup(
    userName: string,
    email: string,
    password: string,
    conpwd: string,
    phone: bigint,
    address: string,
    terms: boolean
  ) {
    if (!userName || !email || !password || !conpwd || !phone || !address) {
      window.alert('All fields are required');
      return Promise.reject('All fields are required');
    }
  
    if (password !== conpwd) {
      window.alert('Password does not match');
      return Promise.reject('Passwords do not match');
    }
  
    if (!this.validateEmail(email)) {
      window.alert('Invalid email format')
      return Promise.reject('Invalid email format');
    }
  
    if (terms==false) {
      window.alert('You must accept terms and conditions');
      return Promise.reject('You must accept the terms and conditions');
    }
  
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result && result.user) {
          // Call the SendVerificationMail() function when a new user signs up and returns a promise
          this.SendVerificationMail();
          // Set user data in Firestore
          this.SetUserData(result.user);
          // Add user data to the Realtime Database
          this.addToRealtimeDatabase(result.user.uid, userName, email, phone, address);
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  
  // Validate email format
  validateEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['user-verification']);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        // Email sent successfully, no need for an alert here
      })
      .catch((error) => {
        // Handle specific Firebase error codes
        switch (error.code) {
          case 'auth/user-not-found':
            window.alert('User not found. Please check your email address.');
            break;
          case 'auth/invalid-email':
            window.alert('Invalid email address. Please provide a valid email.');
            break;
          default:
            window.alert('An error occurred while sending the password reset email.');
            break;
        }
        throw error; // Rethrow the error to maintain the rejection of the promise
      })
      .finally(() => {
        window.alert('Password reset email sent, check your inbox.');
      });
  }
  
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('customers')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `customers/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('customers');
      this.router.navigate(['login']);
    });
  }
  addToRealtimeDatabase(uid: string, userName: string, email: string, phone: bigint, address: string) {
    const userRef = this.db.object(`/customers/${uid}`);
    userRef.set({
      userName: userName,
      email: email,
      phone: phone.toString(),
      address: address
    });
  }
}
