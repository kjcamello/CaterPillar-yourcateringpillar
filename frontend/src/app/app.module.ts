import { NgModule } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { StarRatingComponent } from './components/partials/star-rating/star-rating.component';
import { SearchComponent } from './components/partials/search/search.component';
import { TagsComponent } from './components/partials/tags/tags.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { SignInComponent } from './components/pages/sign-in/sign-in.component';
import { CatererSignUpComponent } from './components/pages/caterer-sign-up/caterer-sign-up.component';
import { PasswordRecoveryComponent } from './components/pages/password-recovery/password-recovery.component';
import { EmailVerificationComponent } from './components/pages/email-verification/email-verification.component';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    StarRatingComponent,
    SearchComponent,
    TagsComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    FormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

bootstrapApplication(AppComponent, {
  providers: [
    
  ]
});

