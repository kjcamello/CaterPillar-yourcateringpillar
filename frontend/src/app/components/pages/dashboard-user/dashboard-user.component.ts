import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
    caterers: Observable<any[]>; // Use the appropriate data type for your caterer documents

  catering: Catering[] = [];
  foodItems: Observable<FoodItem[]>; // Updated data type

  constructor(
    private cateringservice: CateringService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore, // Angular Firestore injection
    private router: Router
  ) {
    // Your existing code to fetch catering data
    this.activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        this.catering = this.cateringservice.getAllCateringbySearchTerm(params.searchTerm);
      } else if (params.tag) {
        this.catering = this.cateringservice.getAllCateringByTag(params.tag);
      } else {
        this.catering = cateringservice.getAll();
      }
    });
  }

  ngOnInit(): void {
    this.caterers = this.firestore.collection('caterers').valueChanges();
    /*
     Fetch the foodItems based on the specific catererUid
    const catererUid = 'your-caterer-uid'; // Replace with the actual caterer's UID
    this.foodItems = this.firestore
      .collection('caterers')
      .doc(catererUid)
      .collection<FoodItem>('foodItems')
      .valueChanges();*/
  }

  /* Fetch Caterer and Catering Information
  fetchCatererData(email: string) {
    // Fetch the Caterer document based on the email
    this.firestore
      .collection('caterers', (ref) => ref.where('catererEmail', '==', email))
      .valueChanges()
      .subscribe((catererData: Caterer[]) => {
        if (catererData.length > 0) {
          this.caterer = catererData[0];

          // You can fetch catering information based on catererUid or any other identifier
          // For now, let's assume it's in the Caterer model
          const cateringInfo = this.caterer.cateringInfo;
          if (cateringInfo) {
            // Use the cateringInfo to display catering details
            console.log(cateringInfo);
          }
        }
      });
  }*/
}