import { Component,OnInit } from '@angular/core';
import { AdminAuthService } from 'src/app/services/adminauth.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class AdminForgotPasswordComponent implements OnInit{

  constructor(
    public adminauthservice: AdminAuthService
 ) { }
 ngOnInit() { }

}