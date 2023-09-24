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

import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path:'', component:HomeComponent },
  { path:'search/:searchTerm', component:HomeComponent },
  { path:'tag/:tag', component:HomeComponent },
  { path:'login',component:LoginComponent },
  { path:'signup',component:SignupComponent },

  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-caterer', component: CatererSignUpComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'forgot-password', component: PasswordRecoveryComponent },
  { path: 'verify-email-address', component: EmailVerificationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
