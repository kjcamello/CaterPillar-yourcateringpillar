import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  // Define properties for form input values
  userName = '';
  email = '';
  pwd = '';
  conpwd = '';
  phone = '';
  address = '';
  terms = false;
  phoneError = false;

  constructor(
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) {
    // Initialize Firebase app
    const firebaseConfig = {
      apiKey: "AIzaSyCx3nRd7cSvuYV-8xaDx1LbJKnGLT27e54",
      authDomain: "caterpillar-hestia.firebaseapp.com",
      projectId: "caterpillar-hestia",
      storageBucket: "caterpillar-hestia.appspot.com",
      messagingSenderId: "457506187045",
      appId: "1:457506187045:web:5f389ea93701f5808d5ccc",
      measurementId: "G-QCVQ7KTVTF",
      databaseURL: "https://caterpillar-hestia-default-rtdb.asia-southeast1.firebasedatabase.app/"
    };    
    
    const app = initializeApp(firebaseConfig);
  }

  signup() {
    // Check if all required fields are filled
    if (!this.userName || !this.email || !this.pwd || !this.conpwd || !this.phone || !this.address) {
      this.toastr.error('Please fill in all fields.', 'Error'); // Display error using Toastr
      return;
    }

    if (this.pwd !== this.conpwd) {
      // Passwords do not match
      this.toastr.error('Passwords do not match.', 'Error'); // Display error using Toastr
      return;
    }

    if (!this.terms) {
      // Terms and Conditions not accepted
      this.toastr.error('Please accept the Terms and Conditions.', 'Error'); // Display error using Toastr
      return;
    }

    // Check if the email is valid
    if (!this.isEmailValid(this.email)) {
      this.toastr.error('Invalid email address.', 'Error'); // Display error using Toastr
      return;
    }

    // Check if the phone number has exactly 10 digits
    if (this.phone.length !== 10) {
      this.phoneError = true;
      this.toastr.error('Phone number must be 10 digits.', 'Error');
      return;
    } else {
      this.phoneError = false;
    }

    // Create user with email and password
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.email, this.pwd)
      .then(() => {
        // Signed up successfully
        // Now, you can add user data to the Firebase Realtime Database
        const database = getDatabase();
        const userRef = ref(database, 'users/' + auth.currentUser?.uid);

        const userData = {
          userName: this.userName,
          email: this.email,
          phone: this.phone,
          address: this.address
        };

        set(userRef, userData)
          .then(() => {
            console.log('User data added to the database');
            // Redirect to the login page
            this.router.navigate(['/login']);
          })
          .catch((error) => {
            console.error('Error adding user data:', error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // Handle errors, e.g., display an error message to the user using Toastr
        this.toastr.error(errorMessage, 'Error');
      });
  }

  isEmailValid(email: string): boolean {
    // Add your email validation logic here, e.g., using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
