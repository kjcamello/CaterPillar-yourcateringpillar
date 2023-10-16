import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
  catering: Catering[] = [];
  selectedFoodItems: FoodItem[] = [];
  foodItems: Observable<FoodItem[]>; // Updated data type
  foodItemForm: FormGroup;

  caterer: any; // To store the caterer data

  constructor(
    private cateringservice: CateringService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore // Angular Firestore injection
  ) {
    this.foodItemForm = this.formBuilder.group({
      food_name: new FormControl('', Validators.required),
      food_description: new FormControl('', Validators.required),
      // Add other form controls for food item properties
    });

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
    this.foodItems = this.firestore.collection<FoodItem>('foodItems').valueChanges();

    // Fetch caterer data
    this.authService.currentEmail.subscribe((email) => {
      if (email) {
        this.fetchCatererData(email);
      }
    });
  }

  //lopez Sprint 2
  fetchCatererData(email: string) {
    // Modify this method to fetch caterer data with catering info from Firestore
    // Fetch the caterer document based on the email (you might need a specific field)
    this.firestore
      .collection('caterers', (ref) => ref.where('email', '==', email))
      .valueChanges()
      .subscribe((catererData) => {
        if (catererData.length > 0) {
          this.caterer = catererData[0];
        }
      });
  }
}
