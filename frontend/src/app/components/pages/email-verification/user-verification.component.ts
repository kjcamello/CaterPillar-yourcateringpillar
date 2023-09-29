import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/services/userauth.service';


@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.css']
})
export class UserVerificationComponent {
  constructor(
    public UserAuthService: UserAuthService
  ) { }
  ngOnInit() {
  }

}
