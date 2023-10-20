import { Component } from '@angular/core';
import { FoodItem } from 'src/app/shared/models/food-item';
//import { FoodItemService } from 'src/app/services/food-item.service';
import { AuthService } from 'src/app/services/auth.service'; //user auth

@Component({
  selector: 'app-diy-package',
  templateUrl: './diy-package.component.html',
  styleUrls: ['./diy-package.component.css']
})
export class DiyPackageComponent {
  showFoodItemForm: boolean = false; // To control the visibility of the food item form
  foodItems: FoodItem[] = []; // An array to store food items in the DIY package

  constructor(private authService: AuthService) {}

  // Function to toggle the visibility of the food item form
  toggleFoodItemForm() {
    this.showFoodItemForm = !this.showFoodItemForm;
  }

  // Function to save a food item to the package
  saveFoodItem(foodItem: FoodItem) {
    this.foodItems.push(foodItem);
    this.toggleFoodItemForm(); // Hide the form after saving
  }
}
