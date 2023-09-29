import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AuthService } from 'path-to-your-auth-service'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  caterer: any;

  constructor(
    private firestore: AngularFirestore, 
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.fetchCatererData();
  }

  fetchCatererData() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const catererRef = this.firestore.collection('caterers').doc(user.uid);
        catererRef.valueChanges().subscribe(data => {
          this.caterer = data;
        });
      }
    });
  }

  logout() {
    this.authService.SignOutCaterer();
    // Redirect or handle post-logout logic here
  }
}
