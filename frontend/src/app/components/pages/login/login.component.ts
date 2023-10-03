import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(
     public userauthservice: UserAuthService
  ) { }
  ngOnInit() { }
}
