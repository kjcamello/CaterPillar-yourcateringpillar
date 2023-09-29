import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule,FormControl, Validators,NgForm, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {
  email : string = ' ';
  constructor(
    public authService: AuthService
  ) { }
  ngOnInit() {
  }
}
