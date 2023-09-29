import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-caterer-sign-up',
  templateUrl: './caterer-sign-up.component.html',
  styleUrls: ['./caterer-sign-up.component.css']
})
export class CatererSignUpComponent implements OnInit{
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  catererEmail: string;
  catererPwd: string;
  catererConfirmPwd: string;

  
  constructor(
    public authService: AuthService,

  ) { }

  ngOnInit() { }

  onSignUpCaterer(catererEmail: any, catererPwd: any, catererCPwd: any) {
    
    if(catererEmail.value === '' && catererPwd.value === '' && catererCPwd.value === ''){
      alert('Input fields are empty.');
      return;
    }
    
    if (!catererEmail.value || catererEmail.value === '') {
      alert('Email is required.');
      return;
    }
    
    if (!catererPwd.value || catererPwd.value === '') {
      alert('Password is required.');
      return;
    }
  
    if (!catererCPwd.value || catererCPwd.value === '') {
      alert('Confirm Password is required.');
      return;
    }

    if (catererPwd.value.length < 8) {
      alert('Password should be at least 8 characters long.')
      return;
    }

    if (!/[A-Z]/.test(catererPwd.value)) {
      alert('Password should contain at least one uppercase letter.');
      return;
    }

    if (!/[0-9]/.test(catererPwd.value)) {
      alert('Password should have at least one number.');
      return;
    }
    
    if(catererPwd.value !== catererCPwd.value){
      alert('Password Does not match');
        return;
    }

    this.authService.SignUpCaterer(catererEmail.value, catererPwd.value);
    
  }

  

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

}
