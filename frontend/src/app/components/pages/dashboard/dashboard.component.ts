import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AuthService } from 'path-to-your-auth-service'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  caterer: any;
  catererUid: string | null = null;
  orders: Observable<any[]>;
  
  constructor(
    private firestore: AngularFirestore, 
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchCatererData();

    this.activatedRoute.paramMap.subscribe(params => {
      this.catererUid = params.get('catererUid');
      if (this.catererUid) {
        this.orders = this.firestore.collection(`caterers/${this.catererUid}/orders`).valueChanges();
      }
    });
  }

  fetchCatererData() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const catererRef = this.firestore.collection('caterers').doc(user.uid);
        catererRef.valueChanges().subscribe(data => {
          this.caterer = data;
          this.catererUid = user.uid;
        });
      }
    });
  }

  logout() {
    this.authService.SignOutCaterer();
    // Redirect or handle post-logout logic here
  }
}
