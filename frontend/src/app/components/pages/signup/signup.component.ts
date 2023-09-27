import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  constructor(
     public userauthservice: UserAuthService
  ) { }
  ngOnInit() { }
}
