//userauthservices.ts
import { Injectable, NgZone } from '@angular/core';
import { Customer} from 'src/app/shared/models/customer';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmailAuthProvider } from 'firebase/auth';
import { Observable, of, switchMap, combineLatest, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Caterer } from '../components/pages/superadmin/superadmin-customer.component';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  [x: string]: any;
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

   getUsers(): Observable<any[]> {
    return this.afAuth.authState.pipe(
      switchMap((authState) => {
        if (authState) {
          // If the user is authenticated, get the logged-in customers from the 'customers' collection
          return this.afs.collection<any>('customers').valueChanges();
        } else {
          // If the user is not authenticated, return an empty observable
          return of([]);
        }
      })
    );
  }
  
  async disableUser(uid: string): Promise<void> {
    try {
      // Update the user's status to 'disabled' in the 'customers' collection
      await this.afs.collection('customers').doc(uid).update({ status: 'disabled' });

      console.log(`User with ID ${uid} disabled successfully.`);
    } catch (error) {
      console.error(`Error disabling user with ID ${uid}:`, error);
      throw error; // Re-throw the error to handle it in the calling code if needed
    }
  }

  deleteUser(uid: string): Promise<void> {
    // Delete the user from Firestore
    return this.afs.collection('customers').doc(uid).delete();
  }
  


  
  
  getCaterers(): Observable<any[]> {
    return this.afAuth.authState.pipe(
      switchMap((authState) => {
        if (authState) {
          // If the user is authenticated, get the logged-in customers from the 'caterers' collection
          // Then, for each caterer document, get the data from the 'catererInfo' subcollection
          return this.afs.collection<any>('caterers').snapshotChanges().pipe(
            switchMap((caterers) => {
              const catererObservables = caterers.map((caterer) => {
                const catererId = caterer.payload.doc.id;
                const catererInfoCollection = this.afs.collection<any>(`caterers/${catererId}/catererBasicInfo`);
                return catererInfoCollection.valueChanges().pipe(
                  map((catererInfo) => ({id:catererId, ...caterer.payload.doc.data(), catererInfo })),
                );
              });
              return combineLatest(catererObservables);
            })
          );
        } else {
          // If the user is not authenticated, return an empty observable
          return of([]);
        }
      })
    );
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
          this.SetUserData(result.user, userName, address, phone,"Active","");
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
  // Reset Forgot password
 ForgotPassword(email: string) {
  if (!email || email.trim() === '') {
    window.alert('Email address is required.');
    return Promise.reject('Email address is required');
  } else {
    // Check if the user with the provided email exists in Firestore
    return this.afs
      .collection('customers', (ref) => ref.where('email', '==', email).limit(1))
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

  // Change user password
  async reauthenticateUser(email: string, oldPassword: string): Promise<void> {
    try {
      const user = this.afAuth.currentUser;
      
      if (!user) {
        throw new Error('No authenticated user found.');
      }

      // Reauthenticate the user with their old password
      const credential = EmailAuthProvider.credential(
        email,
        oldPassword
      );

      await (await user).reauthenticateWithCredential(credential);
    } catch (error) {
      console.error('Error reauthenticating user:', error);
      throw error;
    }
  }

  async changePassword(newPassword: string): Promise<void> {
    try {
      const user = this.afAuth.currentUser;

      if (!user) {
        throw new Error('No authenticated user found.');
      }

      // Update the user's password with the new password
      await (await user).updatePassword(newPassword);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
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
          const uid = result.user.uid;
          // Check user status before allowing login
          this.checkUserStatus(uid)
            .then((status) => {
              if (status === 'active && Normal' ) {
                if (result.user.emailVerified) {
                  // User is logged in and email is verified
                  this.router.navigate(['/dashboard-user']);
                } 
              } else if (status === 'inactive && disabled') {
                // User account is inactive
                window.alert('Your account has been temporarily blocked. You may have violated one of our rules and regulations.');
              } 
            })
            .catch((error) => {
              console.error('Error checking user status:', error);
              // Handle the error, e.g., by displaying a generic error message
              window.alert('An error occurred while checking your account status. Please try again later.');
            });
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
        } else if (error.code === 'auth/too-many-requests') {
          // Too many login attempts
          window.alert('Account Disabled Temporarily. Too many login attempts have been made.');
        } else {
          window.alert('An unexpected error occurred. Please try again later.');
        }
      });
  }
  
  // Function to check user status
  checkUserStatus(uid: string): Promise<string> {
    return this.afs.collection('users').doc(uid).get().toPromise()
      .then((snapshot) => {
        const data = snapshot.data() as { status?: string }; // Explicitly type the data
        return data?.status || 'inactive'; // Set default status to 'inactive'
      })
      .catch((error) => {
        console.error('Error retrieving user status:', error);
        return 'inactive'; // Set default status to 'inactive'
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
  SetUserData(customer: any, userName: string, address:string, phone:bigint, status:string,remarks:string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `customers/${customer.uid}`
    );
    const userData: Customer = {
      uid: customer.uid,
      userName: userName, // Use the userName parameter passed to the method
      email: customer.email,
      address: address,
      phone: phone,
      status: status,
      remarks: remarks
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
