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
  foodItems: any[] = [];
  savedFoodItems: FoodItem[] = [];

  // Define a variable to store the selected food item for editing
  selectedFoodItem: FoodItem | null = null;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private foodItemsService: FoodItemsService
  ) {
    // Fetch your saved food items and assign them to savedFoodItems.
    // You might do this in an ngOnInit() or constructor.
  }

  /*
  editFoodItem(foodItem: FoodItem) {
    // Assign the selected food item for editing
    this.selectedFoodItem = foodItem;
  }

  deleteFoodItem(foodItem: FoodItem) {
    // Implement a method to delete the selected food item.
    // You can call a service method to delete it from the database.
    // Example: this.foodItemsService.deleteFoodItem(foodItem.id);
  }

  // Add a method to save changes when editing
  saveEditedFoodItem() {
    if (this.selectedFoodItem) {
      // Implement the logic to save changes to the selected food item
      this.foodItemsService.updateFoodItem(this.selectedFoodItem.foodItemId, {
        food_name: this.selectedFoodItem.food_name,
        // Add other fields you want to update
      });
      // Once the changes are saved, clear the selectedFoodItem
      this.selectedFoodItem = null;
    }
  }
  */
  updateFoodItem(foodItem: any) {
    // Check if the foodItem is selected for editing
    if (this.selectedFoodItem) {
      // Create a copy of the selectedFoodItem
      const updatedFoodItem = { ...this.selectedFoodItem };

      // Update the properties that you want to change
      updatedFoodItem.food_name = foodItem.food_name;
      updatedFoodItem.food_description = foodItem.food_description;
      updatedFoodItem.minimum_pax = foodItem.minimum_pax;
      updatedFoodItem.pax_price = foodItem.pax_price;

      // Update the food item in Firestore
      this.foodItemsService.updateFoodItem(updatedFoodItem).then(() => {
        // Refresh the list of food items or table to reflect the updated data
        this.loadCategoryItems();
        this.selectedFoodItem = null; // Clear the selectedFoodItem
        alert('Food item updated successfully!');
      }).catch(error => {
        console.error('There was an error updating the food item:', error);
        alert('There was an error updating the food item. Please try again later.');
      });
    }
  }

  deleteFoodItem(foodItem: any) {
    if (confirm('Are you sure you want to delete this food item?')) {
      // Delete the food item from Firestore
      this.foodItemsService.deleteFoodItem(foodItem.id).then(() => {
        // Remove the food item from the local list
        this.foodItems = this.foodItems.filter(item => item.id !== foodItem.id);
        this.selectedFoodItem = null; // Clear the selectedFoodItem
        alert('Food item deleted successfully!');
      }).catch(error => {
        console.error('There was an error deleting the food item:', error);
        alert('There was an error deleting the food item. Please try again later.');
      });
    }
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
