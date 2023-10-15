import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
//import { CatererFoodItemsService } from 'src/app/services/caterer-food-items.service';
//import { FoodItemService } from 'src/app/services/food-item.service';
import { AuthService } from 'src/app/services/auth.service'; //user auth

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
  catering: Catering[] = [];
  selectedFoodItems: FoodItem[] = []; // Declare selectedFoodItems for the DIY package
  foodItems: FoodItem[] = []; // Initialize the foodItems property
  foodItemForm: FormGroup; // Create a form for adding food items

  constructor(
    private cateringservice: CateringService,
    //private catererFoodItemsService: CatererFoodItemsService, // Inject the service for retrieving food items
    private authService: AuthService, // Inject the food item service
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
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

  //lopez sprint 2
  fetchFoodItems() {
    this.authService.getFoodItems().subscribe((foodItems: FoodItem[]) => {
      this.selectedFoodItems = foodItems;
    });
  }//end of lopez s2
  
  ngOnInit(): void {
    this.fetchFoodItems(); //This line by lopez sprint 2
  }

  // Other methods, properties, and logic for your DashboardUserComponent

  // Add the methods for saving food items, handling form submission, etc.
}
