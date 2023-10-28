import { Injectable, NgZone } from '@angular/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent {
  @Input() foodItem: FoodItem;
  @Input() isEditMode: boolean; // Control the edit mode
  @Output() saveFood: EventEmitter<FoodItem> = new EventEmitter<FoodItem>();
  foodItems: FoodItem[] = [];

  errorMessage: string = null;

  editMode: boolean = false; // Property to control edit mode
  editingFoodItem: FoodItem = new FoodItem(); // Placeholder for the food item being edited

  constructor(private authService: AuthService, private afs: AngularFirestore) {}

  uploadFoodImage(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const selectedFile = files[0];
  
      // Check the file's MIME type
      if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg' || selectedFile.type === 'image/png') {
        this.foodItem.food_image = selectedFile;
  
        // Set the image preview
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.foodItem.food_image = e.target.result; // Set the base64 data URL to the food_item's image property
        };
  
        reader.readAsDataURL(selectedFile);
      } else {
        this.errorMessage = 'File not uploaded. It must be a .jpg, .jpeg, or .png file.';
        alert(this.errorMessage);
  
        // Clear the file input so it's not saved
        event.target.value = '';
        this.foodItem.food_image = null; // Clear the preview
      }
    }
  }

  saveFoodItem() {
    this.errorMessage = this.validateFields(this.foodItem);
  
    if (!this.errorMessage) {
      this.saveFood.emit(this.foodItem); // Emit the event to the parent component
      this.isEditMode = false; // Exit edit mode
    } else {
      alert(this.errorMessage);
    }
  }

  updateFoodItem() {
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

/*
  // Add an update method to allow editing
  updateFoodItem() {
    this.isEditMode = true;
  }*/

  private validateFields(foodItem: FoodItem): string | null {
    if (!this.foodItem.food_name || !this.foodItem.food_description || !this.foodItem.minimum_pax || !this.foodItem.pax_price) {
      return 'Please fill in all fields.';
    }

    if (this.foodItem.minimum_pax <= 4) {
      return 'Minimum Pax value must be greater than 4.';
    }

    return null;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;

    if (!this.isEditMode) {
      // Clear the error message and reset the form
      this.errorMessage = null;
      this.foodItem = new FoodItem();
    }
  }

}
