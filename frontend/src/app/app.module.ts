import { NgModule } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule}   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

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
import { ForgotPasswordComponent } from './components/pages/forgotpassword/forgotpassword.component';
import { RouterModule } from '@angular/router';
import { VerifyComponent } from './components/pages/verify/verify.component';
import { VerificationCatererComponent } from './components/pages/verification-caterer/verification-caterer.component';
import { UserVerificationComponent } from './components/pages/email-verification/user-verification.component';
import { SignupHeaderComponent } from './components/partials/signup-header/signup-header.component';
import { CateringinformationComponent } from './components/pages/cateringinformation/cateringinformation.component';
import { TermsComponent } from './components/pages/terms-privacy/terms.component';
import { PrivacyComponent } from './components/pages/terms-privacy/privacy.component';
import { ChangeUserPasswordComponent } from './components/pages/change-user-password/change-user-password.component';
import { ChangeCatererPasswordComponent } from './components/pages/change-caterer-password/change-caterer-password.component';
import { DashboardUserComponent } from './components/pages/dashboard-user/dashboard-user.component';
import { HeaderUserComponent } from './components/partials/header-user/header-user.component';

import { SuperadminComponent } from './components/pages/superadmin/superadmin.component';
import { LoginSuperadminComponent } from './components/pages/superadmin/login-superadmin.component';
import { AdminForgotPasswordComponent } from './components/pages/superadmin/forgotpass.component';

import { HttpClientModule } from '@angular/common/http';
import { TempCatererProfComponent } from './components/pages/temp-caterer-prof/temp-caterer-prof.component';
import { UserDiySelectionComponent } from './components/pages/user-selection/user-diy-selection/user-diy-selection.component';
import { UserPackageSelectionComponent } from './components/pages/user-selection/user-package-selection/user-package-selection.component';
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';

import { DiyPackageComponent } from './components/pages/catering/diy-package/diy-package.component';
import { FoodItemComponent } from './components/pages/catering/food-item/food-item.component';

import { EventItemComponent } from './components/pages/catering/event-item/event-item.component';
import { PackageMenuComponent } from './components/pages/package-menu/package-menu.component';
import { AddServiceTypeComponent } from './components/pages/add-service-type/add-service-type.component';
import { ViewFoodItemComponent } from './components/pages/catering/view-food-item/view-food-item.component';
import { ViewFoodItemTableComponent } from './components/pages/view-food-item-table/view-food-item-table.component';

import { FoodItemsService } from './services/food-items.service';
import { SuperadminCustomerComponent } from './components/pages/superadmin/superadmin-customer.component';
import { ViewCaterersListComponent } from './components/pages/view-caterers-list/view-caterers-list.component';

import { ViewEventTableComponent } from './components/pages/view-tables/view-event-table/view-event-table.component';
import { ViewExtraServiceTableComponent } from './components/pages/view-tables/view-extra-service-table/view-extra-service-table.component';
import { ViewVoucherTableComponent } from './components/pages/view-tables/view-voucher-table/view-voucher-table.component';
import { ViewFoodTableComponent } from './components/pages/view-tables/view-food-table/view-food-table.component';
import { UserOrdersComponent } from './components/pages/user-orders/user-orders.component';
import { UserHistoryComponent } from './components/pages/user-history/user-history.component';
import { UserChangepasswordComponent } from './components/pages/user-changepassword/user-changepassword.component';
import { UserInfoComponent } from './components/pages/user-info/user-info.component';
import { UserVoucherSelectionComponent } from './components/pages/user-selection/user-voucher-selection/user-voucher-selection.component';
import { UserEventSelectionComponent } from './components/pages/user-selection/user-event-selection/user-event-selection.component';
import { UserExtraServiceSelectionComponent } from './components/pages/user-selection/user-extra-service-selection/user-extra-service-selection.component';
// import { CspProfileComponent } from './components/pages/csp-profile/csp-profile.component';
import { ReportComponent } from './components/pages/superadmin/report.component';
import { SendReportComponent } from './components/pages/send-reports/send-reports.component';
import { UserBrowseCateringServiceComponent } from './components/pages/user-browse-catering-service/user-browse-catering-service.component';

//import { MatTabsModule } from '@angular/material/tabs';

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
    ForgotPasswordComponent,
    VerifyComponent,
    DashboardComponent,
    SignInComponent,
    CatererSignUpComponent,
    PasswordRecoveryComponent,
    VerifyComponent,
    VerificationCatererComponent,
    EmailVerificationComponent,
    SignupHeaderComponent,
    CateringinformationComponent,
    UserVerificationComponent,
    TermsComponent,
    PrivacyComponent,
    ChangeUserPasswordComponent,
    ChangeCatererPasswordComponent,
    DashboardUserComponent,
    HeaderUserComponent,
    PackageMenuComponent,
    SuperadminComponent,
    LoginSuperadminComponent,
    AdminForgotPasswordComponent,
    TempCatererProfComponent,
    UserDiySelectionComponent,
    UserPackageSelectionComponent,
    UserProfileComponent,
    DiyPackageComponent,
    FoodItemComponent,   
    EventItemComponent,
    AddServiceTypeComponent,
    ViewFoodItemComponent,
    ViewFoodItemTableComponent,
    SuperadminCustomerComponent,
    ViewCaterersListComponent,
    ViewEventTableComponent,
    ViewExtraServiceTableComponent,
    ViewVoucherTableComponent,
    ViewFoodTableComponent,
    UserOrdersComponent,
    UserHistoryComponent,
    UserChangepasswordComponent,
    UserInfoComponent,
    UserVoucherSelectionComponent,
    UserEventSelectionComponent,
    UserExtraServiceSelectionComponent,
    ReportComponent,
    SendReportComponent,
    UserBrowseCateringServiceComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      progressBar: true
    }),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule, 
    HttpClientModule,
    MatButtonModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

bootstrapApplication(AppComponent, {
  providers: [
    
  ]
});

