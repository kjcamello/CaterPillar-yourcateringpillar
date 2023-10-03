import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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


  constructor(private afAuth: AngularFireAuth, private router: Router, private authService: AuthService, private afs: AngularFirestore) { }

  ngOnInit(): void {
      
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSignInCaterer() {
    if (this.catererBInfo.catererEmail && this.catererBInfo.catererPwd) {
        this.afAuth.signInWithEmailAndPassword(this.catererBInfo.catererEmail, this.catererBInfo.catererPwd)
            .then(userCredential => {
                // After successful authentication, check Firestore
                const uid = userCredential.user?.uid;
                if (uid) {
                    this.afs.doc(`caterers/${uid}`).get().subscribe(docSnapshot => {
                        if (docSnapshot.exists) {
                            console.log('User logged in successfully');
                            this.router.navigate(['/dashboard']); // Redirect to the dashboard
                        } 
                        if(uid){
                          this.afs.doc(`customers/${uid}`).get().subscribe(docSnapshot => {
                            if (docSnapshot.exists) {
                              console.log('User logged in successfully');
                              this.router.navigate(['/catering-information']); // Redirect to the dashboard
                          } 
    
                           });
                        }
                        else{
                          console.error('Authentication failed: User data not found in Firestore.');
                          alert('Authentication failed. Please contact support.');
                          this.afAuth.signOut();  // Sign out the user from Firebase Auth
                      }

                    });
                }
            })
            .catch(error => {
                console.error('Error during sign-in:', error);
                alert('Login failed: ' + error.message);
            });
    } else {
        alert('Please enter your email and password.');
    }
}

  checkDocumentExists(uid: string): void {
    this.afs.doc(`caterers/${uid}`).get().subscribe(docSnapshot => {
        if (docSnapshot.exists) {
            console.log('Document exists in Firestore.');
            // Handle the logic for existing document here
        } else {
            console.log('Document does not exist in Firestore.');
            // Handle the logic for non-existing document here
        }
    });
}

}
