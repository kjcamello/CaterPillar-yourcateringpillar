import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/services/userauth.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule,FormControl, Validators,NgForm, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})

  export class ForgotPasswordComponent implements OnInit{
    email : string = ' ';
    constructor (
      public userAuthService: UserAuthService
      ) { }

    ngOnInit(){}

    // sendLink() {

    //   if (!this.email) {
    //     alert("Please provide an email address.");
    //     return;
    //   }

    //   this.userAuthService.ForgotPassword(this.email)
    //   .then(
    //     () => alert('A password reset link has been sent to your email address'),
    //     (rejectionReason) => alert(rejectionReason))
    //   .catch((e: any) => alert('An error occured while attempting to reset your password'));

    // }

    }
  
 
  
  


