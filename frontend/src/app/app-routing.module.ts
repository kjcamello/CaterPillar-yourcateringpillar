import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatererSignUpComponent } from './components/pages/caterer-sign-up/caterer-sign-up.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { EmailVerificationComponent } from './components/pages/email-verification/email-verification.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { PasswordRecoveryComponent } from './components/pages/password-recovery/password-recovery.component';
import { SignInComponent } from './components/pages/sign-in/sign-in.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { UserVerificationComponent } from './components/pages/email-verification/user-verification.component';
import { TermsComponent } from './components/pages/terms-privacy/terms.component';
import { PrivacyComponent } from './components/pages/terms-privacy/privacy.component';
import { AuthGuard } from './guard/auth.guard';
import { ForgotPasswordComponent } from './components/pages/forgotpassword/forgotpassword.component';
import { CateringinformationComponent } from './components/pages/cateringinformation/cateringinformation.component';
import { VerifyComponent } from './components/pages/verify/verify.component';
import { VerificationCatererComponent } from './components/pages/verification-caterer/verification-caterer.component';
// import { PackageMenuComponent } from/

import { ChangeUserPasswordComponent } from './components/pages/change-user-password/change-user-password.component';
import { ChangeCatererPasswordComponent } from './components/pages/change-caterer-password/change-caterer-password.component';

import { DashboardUserComponent } from './components/pages/dashboard-user/dashboard-user.component';

import { HeaderComponent } from './components/partials/header/header.component';
import { HeaderUserComponent } from './components/partials/header-user/header-user.component';
import { PackageMenuComponent } from './components/pages/package-menu/package-menu.component';
import { SuperadminComponent } from './components/pages/superadmin/superadmin.component';
import { LoginSuperadminComponent } from './components/pages/superadmin/login-superadmin.component';
import { AdminAuthService } from './services/adminauth.service';
import { AdminForgotPasswordComponent } from './components/pages/superadmin/forgotpass.component';

import { DiyPackageComponent } from './components/pages/catering/diy-package/diy-package.component';
import { ViewFoodItemComponent } from './components/pages/catering/view-food-item/view-food-item.component';

import { UserPackageSelectionComponent } from './components/pages/user-selection/user-package-selection/user-package-selection.component';
import { UserDiySelectionComponent } from './components/pages/user-selection/user-diy-selection/user-diy-selection.component'; //temporary



import { UserProfileComponent } from './components/pages/user-profile/user-profile.component'; 
import { AddServiceTypeComponent } from './components/pages/add-service-type/add-service-type.component';
import { SuperadminCustomerComponent } from './components/pages/superadmin/superadmin-customer.component';

const routes: Routes = [
  { path:'', component:HomeComponent },
  { path:'search/:searchTerm', component:HomeComponent },
  { path:'tag/:tag', component:HomeComponent },
  { path:'login',component:LoginComponent },
  { path:'signup',component:SignupComponent },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-caterer', component: CatererSignUpComponent },
  { path: 'catering-information', component: CateringinformationComponent},
  { path: 'dashboard-caterer', component: DashboardComponent },
  { path: 'forgot-password', component: PasswordRecoveryComponent },
  { path: 'verify-email-address', component: EmailVerificationComponent },
  { path: 'user-verification', component: UserVerificationComponent},
  { path: 'forgotpassword', component: ForgotPasswordComponent},
  { path: 'verify', component: VerifyComponent},
  { path: 'password-recovery', component: PasswordRecoveryComponent},
  { path: 'verification-caterer', component: VerificationCatererComponent},
  { path: 'verify', component: VerifyComponent},
  { path: 'terms', component: TermsComponent},
  { path: 'privacy-policy', component: PrivacyComponent},
  { path: 'change-user-password', component: ChangeUserPasswordComponent},
  { path: 'change-caterer-password', component: ChangeCatererPasswordComponent},
  { path: 'dashboard-user', component: DashboardUserComponent },
  { path: 'package-menu', component: PackageMenuComponent},
  
  { path: 'header', component: HeaderComponent },
  { path: 'header-user', component: HeaderUserComponent },
  { path: 'superadmin', component: SuperadminComponent},
  { path: 'login-superadmin', component: LoginSuperadminComponent},
  { path: 'admin-forgotpass', component: AdminForgotPasswordComponent},

  { path: 'add-service-type', component: AddServiceTypeComponent},
  { path: 'diy-package', component: DiyPackageComponent},

  { path: 'dashboard-user', component: DashboardUserComponent },
  //{ path: 'caterer-profile/:catererId', component: TempCatererProfComponent }, //temporary profile ra ni for the meantime (Lopez)
  //{ path: 'caterer-profile/:catererId/diy-package/:packageId', component: DiyPackageComponent },

  { path: 'view-food-item', component: ViewFoodItemComponent },


  { path: 'user-package-selection', component: UserPackageSelectionComponent },
  { path: 'user-diy-selection/:catererUid', component: UserDiySelectionComponent },
  
  { path: 'temp-caterer-prof/:id', component: UserDiySelectionComponent },



  { path: 'user-profile', component: UserProfileComponent },  // <-- This is the last route, so no comma after this
    // ...other routes
  {path: 'superadmin-customer', component: SuperadminCustomerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
