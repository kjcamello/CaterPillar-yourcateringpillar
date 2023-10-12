import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from 'src/app/services/adminauth.service';

@Component({
  selector: 'app-login-superadmin',
  templateUrl: './login-superadmin.component.html',
  styleUrls: ['./login-superadmin.component.css']
})
export class LoginSuperadminComponent implements OnInit{

  constructor(
    public adminauthservice: AdminAuthService
 ) { }
 ngOnInit() { }

}
