// Import necessary modules and services
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AppetizerItem } from 'src/app/shared/models/appetizer-item';

import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-diy-package',
  templateUrl: './diy-package.component.html',
  styleUrls: ['./diy-package.component.css']
})
export class DiyPackageComponent implements OnInit {
  // Initialize your existing properties
  showFoodItemForm: boolean = false;
  foodItems: FoodItem[] = [];
  newFoodItem: FoodItem = new FoodItem();
  errorMessage: string = null;

    // Initialize your existing properties
    showAppetizerItemForm: boolean = false;
    appetizerItems: AppetizerItem[] = [];
    newAppetizerItem: AppetizerItem = new AppetizerItem();

  // Add a new property to fetch saved food items
  savedFoodItems: Observable<FoodItem[]> = null;

  savedAppetizerItems: Observable<AppetizerItem[]> = null;

  catererId: string; // Define catererId here

  editMode: boolean = false; // Property to control edit mode
  editingFoodItem: FoodItem = new FoodItem(); // Placeholder for the food item being edited
  editingAppetizerItem: AppetizerItem = new AppetizerItem(); // Placeholder for the food item being edited

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    // Access the route parameters to get the caterer's ID
    this.activatedRoute.params.subscribe(params => {
      const catererId = params['id']; // Adjust this based on your route

      // Fetch saved food items for the specific caterer
      this.savedFoodItems = this.firestore
        .collection('caterers')
        .doc(catererId)
        .collection<FoodItem>('foodItems')
        .valueChanges();
    });
    
    this.activatedRoute.params.subscribe(params => {
      const catererId = params['id']; // Adjust this based on your route

      // Fetch saved food items for the specific caterer
      this.savedAppetizerItems = this.firestore
        .collection('caterers')
        .doc(catererId)
        .collection<AppetizerItem>('appetizerItems')
        .valueChanges();
    });
  }



  ngOnInit(): void {
    // Fetch the caterer's ID and retrieve food items for the caterer
    this.activatedRoute.params.subscribe((params) => {
      const catererId = params['id']; // Adjust based on your route
      this.catererId = catererId; // Store the caterer's ID for later use
  
      // Subscribe to the Firestore collection
      this.firestore
        .collection('caterers')
        .doc(catererId)
        .collection<FoodItem>('foodItems')
        .valueChanges()
        .subscribe((foodItems) => {
          this.foodItems = foodItems;
        });

        this.firestore
        .collection('caterers')
        .doc(catererId)
        .collection<AppetizerItem>('appetizerItems')
        .valueChanges()
        .subscribe((appetizerItems) => {
          this.appetizerItems = appetizerItems;
        });
    });
  }

  toggleFoodItemForm() {
    this.showFoodItemForm = !this.showFoodItemForm;

    // Clear the error message
    this.errorMessage = null;

    if (!this.showFoodItemForm) {
      // Reset the new food item fields
      this.newFoodItem = new FoodItem();
    }
  }

  toggleAppetizerItemForm() {
    this.showAppetizerItemForm = !this.showAppetizerItemForm;

    // Clear the error message
    this.errorMessage = null;

    if (!this.showAppetizerItemForm) {
      // Reset the new food item fields
      this.newAppetizerItem = new AppetizerItem();
    }
  }



  saveFoodItem(foodItem: FoodItem, index: number) {
    this.errorMessage = this.validateFields(foodItem);
  
    if (!this.errorMessage) {
      try {
        this.authService.saveFoodItem(foodItem); // Save food item
        alert('Food item saved successfully.');
        this.foodItems.push(foodItem);
        this.toggleFoodItemForm();
  
        // Remove the saved food item from the newFoodItem list
        if (index !== undefined) {
          this.foodItems.splice(index, 1);
        }
      } catch (error) {
        alert('Error saving food item: ' + error);
      }
    } else {
      alert(this.errorMessage);
    }
  }
  /*
  saveAppetizerItem(appetizerItem: AppetizerItem, index: number) {
    this.errorMessage = this.validateAppetizerFields(appetizerItem);
  
    if (!this.errorMessage) {
      try {
        this.authService.saveAppetizerItem(appetizerItem); // Save food item
        alert('Food item saved successfully.');
        this.appetizerItems.push(appetizerItem);
        this.toggleAppetizerItemForm();
  
        // Remove the saved food item from the newFoodItem list
        if (index !== undefined) {
          this.appetizerItems.splice(index, 1);
        }
      } catch (error) {
        alert('Error saving food item: ' + error);
      }
    } else {
      alert(this.errorMessage);
    }
  }*/

  
  

  private validateFields(foodItem: FoodItem): string | null {
    if (!foodItem.food_name || !foodItem.food_description || !foodItem.minimum_pax || !foodItem.pax_price) {
      return 'Please fill in all fields.';
    }

    if (foodItem.minimum_pax <= 4) {
      return 'Minimum Pax value must be greater than 4.';
    }

    return null;
  }


  private validateAppetizerFields(appetizerItem: AppetizerItem): string | null {
    if (!appetizerItem.appetizer_name || !appetizerItem.appetizer_description || !appetizerItem.minimum_pax || !appetizerItem.pax_price) {
      return 'Please fill in all fields.';
    }

    if (appetizerItem.minimum_pax <= 4) {
      return 'Minimum Pax value must be greater than 4.';
    }

    return null;
  }


  toggleEditMode(foodItem: FoodItem) {
    this.editingFoodItem = { ...foodItem }; // Create a copy for editing
    this.editMode = true;
  }

  cancelEdit() {
    this.editingFoodItem = new FoodItem(); // Clear the editingFoodItem
    this.editMode = false;
  }

  updateFoodItem(foodItem: FoodItem) {
    const foodItemToUpdate = { ...this.editingFoodItem };
    // Perform validation here if needed

    // Call a service method to update the food item in Firestore using the existing foodItem ID
    this.authService.updateFoodItem(foodItemToUpdate)
      .then(() => {
        // Update the local foodItems array with the updated item
        const index = this.foodItems.findIndex(item => item.foodItemId === foodItemToUpdate.foodItemId);
        if (index !== -1) {
          this.foodItems[index] = { ...foodItemToUpdate };
        }

        this.editingFoodItem = new FoodItem();
        this.editMode = false;
        alert('Food item updated successfully.');
      })
      .catch(error => {
        alert('Error updating food item: ' + error);
      });
  }



}
