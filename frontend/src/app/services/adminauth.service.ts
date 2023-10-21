import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private ngZone: NgZone // Inject NgZone for showing alerts outside of Angular's zone
  ) {}

  login(email: string, password: string): void {
    // Check if the email is in the "superadmin" collection
    const superadminCollection = this.firestore.collection('superadmin', (ref) =>
      ref.where('email', '==', email)
    );

    superadminCollection
      .get()
      .toPromise()
      .then((superadminDocs) => {
        if (!superadminDocs.empty) {
          // If the email exists, sign in using Firebase authentication
          this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then(() => {
              console.log('User logged in successfully');
              this.router.navigate(['superadmin']);  
            })
            .catch((error) => {
              // Handle authentication errors and display window alert
              this.ngZone.run(() => {
                window.alert('Authentication error: ' + error.message);
              });
            });
        } else {
          // Email not found in "superadmin" collection
          // Display a window alert to indicate that the user is not authorized.
          this.ngZone.run(() => {
            window.alert('User not authorized');
          });
        }
      })
      .catch((error) => {
        // Handle Firestore query errors and display window alert
        this.ngZone.run(() => {
          window.alert('Firestore query error: ' + error.message);
        });
      });
  }

   // "Forgot Password" function
   forgotPassword(email: string): void {
    
    this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        // Password reset email sent successfully
        this.ngZone.run(() => {
          window.alert('Password reset email sent. Check your inbox.');
        });
      })
      .catch((error) => {
        // Handle password reset errors and display window alert
        this.ngZone.run(() => {
          window.alert('Please input a valid email address to proceed.');
        });
      })
      
  }
}

