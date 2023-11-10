import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-food-item-table',
  templateUrl: './view-food-item-table.component.html',
  styleUrls: ['./view-food-item-table.component.css']
})
export class ViewFoodItemTableComponent implements OnInit {
  selectedCategory: string = 'Main Course';
  foodItems: any[] = [];
  selectedFoodItem: any = null; // Hold the selected food item for editing

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadCategoryItems();
  }

  loadCategoryItems() {
    const catererUid = this.authService.getCatererUid();
    const selectedCategory = this.selectedCategory.toLowerCase();

    this.firestore
      .collection('caterers')
      .doc(catererUid)
      .collection(`${selectedCategory}Items`)
      .valueChanges()
      .subscribe((items: any[]) => {
        console.log('Fetched items:', items);
        this.foodItems = items;
      });
  }
  
  deleteFoodItem(foodItem: any): void {
    const catererUid = this.authService.getCatererUid();
    const selectedCategory = this.selectedCategory.toLowerCase();
    const foodItemId = foodItem.foodItemId;
  
    // Remove or comment out console.log statements
  
    // Display a confirmation prompt
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
  
    if (isConfirmed) {
      if (catererUid && selectedCategory && foodItemId) {
        const docRef = this.firestore.doc(`caterers/${catererUid}/${selectedCategory}Items/${foodItemId}`);
  
        docRef.delete().then(() => {
          // Optionally, you can also remove the item from the local array to update the UI.
          this.foodItems = this.foodItems.filter(item => item.foodItemId !== foodItemId);
  
          // Show a success notification or alert
          alert('Food item deleted successfully!');
        }).catch(error => {
          // Show a user-friendly error message
          alert('An error occurred while deleting the food item. Please try again later.');
  
          // Log the detailed error to the server or analytics tool
          console.error('Error deleting food item:', error);
        });
      } else {
        // Show a user-friendly error message for invalid parameters
        alert('Invalid parameters for deleting food item.');
      }
    } else {
      // User cancelled the deletion
      console.log('Deletion cancelled by user.');
    }
  }
  
  editFoodItem(foodItem: any) {
    // Set the selected food item for editing
    this.selectedFoodItem = { ...foodItem };
  }

  // Method to handle image changes in the edit form
  uploadEditFoodImage(event: any) {
    if (this.selectedFoodItem) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.selectedFoodItem.food_image = e.target.result;
        };

        reader.readAsDataURL(selectedFile);
      }
    }
  }


  updateFoodItem() {
    if (this.selectedFoodItem) {
      // Update the food item in Firestore
      const catererUid = this.authService.getCatererUid();

      if (catererUid) {
        const selectedCategory = this.selectedCategory.toLowerCase();

        this.firestore
          .collection('caterers')
          .doc(catererUid)
          .collection(`${selectedCategory}Items`)
          .doc(this.selectedFoodItem.foodItemId)
          .update(this.selectedFoodItem)
          .then(() => {
            console.log('Food item updated successfully.');
            this.selectedFoodItem = null; // Reset selectedFoodItem after update
          })
          .catch(error => {
            console.error('Error updating food item:', error);
          });
      }
    }
  }
}