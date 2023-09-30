//userauthservices.ts
import { Injectable, NgZone } from '@angular/core';
import { Customer} from 'src/app/shared/models/customer';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, 
    private toastr: ToastrService// NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((customer) => {
      if (customer) {
        this.userData = customer;
        localStorage.setItem('customer', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('customer')!);
      } else {
        localStorage.setItem('customer', 'null');
        JSON.parse(localStorage.getItem('customer')!);
      }
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
   
  ) {
    if (!userName || !email || !password || !conpwd || !phone || !address) {
      window.alert('All fields are required');
      return Promise.reject('All fields are required');
    }
  
    if (password !== conpwd) {
      window.alert('Password does not match');
      return Promise.reject('Passwords do not match');
    }
    if (!this.isStrongPassword(password)) {
      window.alert('Password must contain at least one uppercase letter, one lowercase letter, and one special symbol.');
      return Promise.reject('Password strength requirement not met');
    }
  
    if (!this.validateEmail(email)) {
      window.alert('Invalid email format')
      return Promise.reject('Invalid email format');
    }
  
  
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result && result.user) {
          // Call the SendVerificationMail() function when a new user signs up and returns a promise
          this.SendVerificationMail();
          // Set user data in Firestore
          this.SetUserData(result.user, userName, address, phone);
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
  ForgotPassword(email: string) {
    if (!email || email.trim() ==='') {
        window.alert('Email address is required.');
        return Promise.reject('Email address is required');
    }
  else{

      // Send a password reset email
      return this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => {
          // Email sent successfully, no need for an alert here
          window.alert('Password reset email sent, check your inbox.');
          this.router.navigate(['login']);
      })
      .catch((error) => {
          if (error.code === 'auth/user-not-found') {
              // User with this email does not exist
              window.alert('User with this email does not exist.');
          } else {
              // Handle other errors
              console.error('Error sending password reset email:', error);
              window.alert('An error occurred while sending the password reset email. User might not be registered yet.');
          }
          throw error; // Rethrow the error to maintain the rejection of the promise
      });
    }
  
}

Login(email: string, password: string) {
  if (!email || !password) {
    window.alert('Both email and password are required.');
    return Promise.reject('Both email and password are required');
  }

  return this.afAuth
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      if (result.user) {
        if (result.user.emailVerified) {
          // User is logged in and email is verified
          this.router.navigate(['/']);
        } else {
          // User is logged in but email is not verified
          window.alert('Please verify your email address before logging in.');
        }
      } 
    })
    .catch((error) => {
      console.error('Login error:', error);

      if (error.code === 'auth/invalid-login-credentials') {
        // User with this email does not exist
        window.alert('Incorrect email or password');
      } else if (error.code === 'auth/invalid-email') {
        // Invalid email format
        window.alert('Invalid email address. Please provide a valid email.');
      } 
      else if (error.code === 'auth/too-many-requests') {
        // Invalid email format
        window.alert('Invalid email address. Please provide a valid email.');}
      else
        window.alert(error)
    });
}





  
  
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const customer = JSON.parse(localStorage.getItem('customers')!);
    return customer !== null && customer.emailVerified !== false ? true : false;
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(customer: any, userName: string, address:string, phone:bigint) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `customers/${customer.uid}`
    );
    const userData: Customer = {
      uid: customer.uid,
      userName: userName, // Use the userName parameter passed to the method
      email: customer.email,
      address: address,
      phone: phone,
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
  isStrongPassword(password: string) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
    return passwordPattern.test(password);
  }

}
