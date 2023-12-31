import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';

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
    // Check if the email is recognized as a superadminemail
    if (this.isSuperAdminEmail(email)) {
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
            window.alert('Password reset error: ' + error.message);
          });
        });
    } else {
      // Notify the user that the email is not recognized as a superadmin email
      this.ngZone.run(() => {
        window.alert('Invalid email for password reset. Superadmin email required.');
      });
    }
  }
  
  // Function to check if the email is recognized as a superadmin email
  private isSuperAdminEmail(email: string): boolean {
    const superAdminEmails = ['ninopatricknolidolopez@gmail.com'
    , 'norbz.vergara.27@gmail.com', 'baniladjimkenn2301@gmail.com', 'kentjustine.camello@gmail.com', 'chanzyongco@gmail.com'];
    return superAdminEmails.includes(email);
  }

  getCustomerReports(): Observable<any[]> {
    return this.firestore.collection('reports').doc('customer').collection('details').valueChanges();
  }

  getCatererReports(): Observable<any[]> {
    return this.firestore.collection('reports').doc('caterer').collection('details').valueChanges();
  }

  getSettledReports(): Observable<any[]> {
    const catererSettled$ = this.firestore.collection('settled').doc('caterer').collection('details').valueChanges();
    const customerSettled$ = this.firestore.collection('settled').doc('customer').collection('details').valueChanges();
  
    return combineLatest([catererSettled$, customerSettled$]).pipe(
      map(([catererSettled, customerSettled]) => [...catererSettled, ...customerSettled])
    );
  }

  countUserReports(username: string) {
    const settledCaterer$ = this.firestore.collection('settled').doc('caterer').collection('details').valueChanges();
    const settledCustomer$ = this.firestore.collection('settled').doc('customer').collection('details').valueChanges();
    const reportsCustomer$ = this.firestore.collection('reports').doc('customer').collection('details').valueChanges();
    const reportsCaterer$ = this.firestore.collection('reports').doc('caterer').collection('details').valueChanges();
  
    // Combine all observables into a single observable
    combineLatest([settledCaterer$, settledCustomer$, reportsCustomer$, reportsCaterer$]).pipe(
      map(([settledCaterer, settledCustomer, reportsCustomer, reportsCaterer]) => {
        // Merge data from all collections into one array
        const allReports = [...settledCaterer, ...settledCustomer, ...reportsCustomer, ...reportsCaterer];
  
        // Filter and count occurrences of the username in the merged data
        const userReports = allReports.filter(report => report.reportedUsername === username);
        const count = userReports.length;
        
        return count;
      })
    ).subscribe(count => {
      // Use the count here or emit it to another part of your application
      console.log(`User ${username} was reported ${count} times.`);
      // You can perform further actions with the count here
    });
  }
  
  
  
}

