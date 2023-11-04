import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

import { FoodItem } from 'src/app/shared/models/food-item';
import { FoodItemsService } from 'src/app/services/food-items.service';

@Component({
  selector: 'app-view-food-item',
  templateUrl: './view-food-item.component.html',
  styleUrls: ['./view-food-item.component.css']
})
export class ViewFoodItemComponent implements OnInit {
  selectedCategory: string = 'Main Course';
  foodItems: any[] = []; // To store the retrieved items
  savedFoodItems: FoodItem[] = [];


  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private foodItemsService: FoodItemsService
  ) {
        // Fetch your saved food items and assign them to savedFoodItems.
    // You might do this in an ngOnInit() or constructor.
  }

  editFoodItem(foodItem: FoodItem) {
    // Implement navigation or open a dialog for editing the selected food item.
    // For navigation, you can use the Angular Router.
    // Example: this.router.navigate(['/food-item-edit', foodItem.id]);
  }

  deleteFoodItem(foodItem: FoodItem) {
    // Implement a method to delete the selected food item.
    // You can call a service method to delete it from the database.
    // Example: this.foodItemsService.deleteFoodItem(foodItem.id);
  }

  ngOnInit() {
    this.loadCategoryItems();
  }

  loadCategoryItems() {
    const catererUid = this.authService.getCatererUid();
    const selectedCategory = this.selectedCategory.toLowerCase();
    
    this.afs
      .collection('caterers')
      .doc(catererUid)
      .collection(`${selectedCategory}Items`)
      .valueChanges()
      .subscribe((items: any[]) => {
        this.foodItems = items;
      });
  }
}