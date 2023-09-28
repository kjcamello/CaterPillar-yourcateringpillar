import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
  email : string = ' ';
    constructor (public userAuthService: UserAuthService) {

    }

    ngOnInit(): void {}

    sendLink() {
      this.userAuthService.ForgotPassword(this.email);
      this.email = ' ';

    }
}
