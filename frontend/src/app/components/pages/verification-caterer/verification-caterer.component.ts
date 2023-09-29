import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-verification-caterer',
  templateUrl: './verification-caterer.component.html',
  styleUrls: ['./verification-caterer.component.css']
})
export class VerificationCatererComponent {
  email : string = ' ';
  constructor (public authService: AuthService) {

  }

  ngOnInit(): void {}

  sendLink() {
    this.authService.ForgotPassword(this.email);
    this.email = ' ';

  }
}
