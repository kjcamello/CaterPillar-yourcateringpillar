import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-caterer-sign-up',
  templateUrl: './caterer-sign-up.component.html',
  styleUrls: ['./caterer-sign-up.component.css']
})
export class CatererSignUpComponent implements OnInit{
  constructor(
    public authService: AuthService,

  ) { }
  
  onSignUpCaterer(userEmail: any, userPwd: any, businessName: any, contactNumber: any, businessAddress: any) {
    this.authService.SignUpCaterer(userEmail.value, userPwd.value, businessName.value, contactNumber.value, businessAddress.value);
}
  
  ngOnInit() { }
}
