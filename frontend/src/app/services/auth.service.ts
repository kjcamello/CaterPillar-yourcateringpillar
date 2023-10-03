import { Injectable, NgZone } from '@angular/core';
import { Caterer } from 'src/app/shared/models/caterer';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  catererData: any; // Save logged in caterer data

  private emailSource = new BehaviorSubject<string>('default@email.com');
  currentEmail = this.emailSource.asObservable();

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone
  ) {
    // Saving caterer data in local storage when logged in and setting up null when logged out
    this.afAuth.authState.subscribe((caterer) => {
      if (caterer) {
        this.catererData = caterer;
        localStorage.setItem('caterer', JSON.stringify(this.catererData));
      } else {
        localStorage.removeItem('caterer');
      }
    });
  }
  setEmail(email: string) {
    this.emailSource.next(email);
  }
  // SignIn Caterer with email and password
  SignInCaterer(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(result => {
        this.SetUserDataCaterer(result.user);
        this.navigateToDashboardIfAuthenticated();
      })
      .catch(error => window.alert(error.message));
  }

  // SignUp Caterer with email and password and save extra data
  SignUpCaterer(catererData: any, email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        this.SendVerificationMail();
        this.SetUserDataCaterer(result.user);
        this.navigateToCateringInformation();
      })
      .catch(error => window.alert(error.message));
  }

  // Navigate to dashboard if caterer is authenticated
  private navigateToDashboardIfAuthenticated() {
    this.afAuth.authState.subscribe(caterer => {
      if (caterer) this.router.navigate(['dashboard']);
    });
  }

  // Navigate to catering information page
  private navigateToCateringInformation() {
    this.router.navigate(['catering-information']);
  }

  // Send email verification to caterer's email
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u:any) => u.sendEmailVerification())
      .then(() => alert('Email verification has been sent. Please check your inbox.'))
      .catch(error => alert('Error sending email verification: ' + error.message));
  }

  ForgotPassword(email: string) {
    if (!email || email.trim() === '') {
      window.alert('Email address is required.');
      return Promise.reject('Email address is required');
    } else {
      // Check if the user with the provided email exists in Firestore
      return this.afs
        .collection('caterers', (ref) => ref.where('email', '==', email).limit(1))
        .get()
        .toPromise()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // User with this email does not exist
            return window.alert('User with this email does not exist.');
          } else {
            // Send a password reset email
            return this.afAuth
              .sendPasswordResetEmail(email)
              .then(() => {
                // Email sent successfully, no need for an alert here
                window.alert('Password reset email sent, check your inbox.');
                this.router.navigate(['login']);
              })
              .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                  window.alert('Invalid email format.');
                } else {
                  // Handle other errors
                  console.error('Error sending password reset email:', error);
                  window.alert('An error occurred while sending the password reset email.');
                }
                throw error; // Rethrow the error to maintain the rejection of the promise
              });
          }
        })
        .catch((error) => {
          // Handle Firestore query error
          console.error('Error checking email existence in Firestore:', error);
          window.alert('An error occurred while checking email existence.');
          throw error;
        });
    }
  }

  // Check if Caterer is logged in
  get CatererisLoggedIn(): boolean {
    const caterer = JSON.parse(localStorage.getItem('caterer') || '{}');
    return caterer && caterer.emailVerified ? true : false;
  }

  // Set caterer data in firestore database
  SetUserDataCaterer(caterer: any): void {
    const catererRef: AngularFirestoreDocument<any> = this.afs.doc(`caterer/${caterer.uid}`);
    catererRef.set(caterer, { merge: true })
      .catch(error => console.error("Error saving to Firestore:", error));
  }

  // Sign out caterer
  SignOutCaterer() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('caterer');
      this.router.navigate(['sign-in']);
    });
  }

  // Save catering data in firestore
  saveCateringData(catererUid: string, cateringInfo: any, catererInfo: any): Promise<void> {
    const catererRef: AngularFirestoreDocument<any> = this.afs.doc(`catererInfo/${catererUid}`);
    const combinedData = { cateringInfo, catererInfo };
    return catererRef.set(combinedData, { merge: true });
  }

  // Get caterer UID
  getCatererUid(): string | null {
    return this.catererData ? this.catererData.uid : null;
  }

  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(result => {
        console.log('User logged in successfully');
        this.router.navigate(['/dashboard']);  // Navigate to user's dashboard or some other page
      })
      .catch(error => {
        console.error('Error during sign-in:', error);
        alert('Login failed: ' + error.message);
      });
  }
  
}
