import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-extra-service-table',
  templateUrl: './view-extra-service-table.component.html',
  styleUrls: ['./view-extra-service-table.component.css']
})
export class ViewExtraServiceTableComponent implements OnInit {
  extraserviceItems: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    ) {}

  ngOnInit(): void {
    this.loadExtraserviceItems();
  }

  loadExtraserviceItems() {
    const catererUid = this.authService.getCatererUid();

    if (catererUid) {
      this.firestore
        .collection('caterers')
        .doc(catererUid)
        .collection('extraserviceItems')
        .valueChanges()
        .subscribe(
          (items: any[]) => {
            console.log('Fetched extra service items:', items);
            this.extraserviceItems = items;
          },
          (error) => {
            console.error('Error fetching extra service items:', error);
          }
        );
    }
  }
}

  
  /*
  deleteExtraServiceItem(extraserviceItem: any): void {
    const catererUid = this.authService.getCatererUid();
    //const selectedCategory = this.selectedCategory.toLowerCase();
    const extraserviceItemId = extraserviceItem.extraserviceItemId;
  
    // Display a confirmation prompt
    const isConfirmed = window.confirm('Are you sure you want to delete this food item?');
  
    if (isConfirmed) {
      if (catererUid && extraserviceItemId) {
        const docRef = this.firestore.doc(`caterers/${catererUid}/extraserviceItems/${extraserviceItemId}`);
  
        docRef.delete().then(() => {
          // Optionally, you can also remove the item from the local array to update the UI.
          this.extraserviceItems = this.extraserviceItems.filter(item => item.foodItemId !== extraserviceItemId);
  
          // Show a success notification or alert
          alert('Food item deleted successfully.');
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

//Update Food Item (Sprint 3)
updateFoodItem() {
  if (this.confirmationPrompt()) {
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
              alert('Food item updated successfully.');
              this.selectedFoodItem = null; // Reset selectedFoodItem after update
            })
            .catch(error => {
              alert('Error updating food item: ' + error);
            });
        }
      }
}

  toggleUpdateFoodItemForm(foodItem: any) {
    this.selectedFoodItem = { ...foodItem };
  }

  cancelUpdate(): void {
    const isConfirmed = window.confirm('Are you sure you want to cancel the food item update?');
    if (isConfirmed) {
      // Reset the selectedFoodItem and hide the form
      this.selectedFoodItem = null;
    }
  }
  
  
  confirmationPrompt() {
    if (this.validateFields()) {
      const confirm = window.confirm('Are you sure you want to update food item changes?');
      return confirm;
    }
    return false;
  }
  
  validateFields() {
    if (
      this.selectedFoodItem.food_name &&
      this.selectedFoodItem.food_description &&
      this.selectedFoodItem.minimum_pax !== null &&
      this.selectedFoodItem.pax_price !== null &&
      this.selectedFoodItem.maximum_pax !== null &&
      (this.selectedFoodItem.category !== null && this.selectedFoodItem.category !== '') &&
      this.selectedFoodItem.minimum_pax >= 5 && // Minimum pax check
      this.selectedFoodItem.minimum_pax <= this.selectedFoodItem.maximum_pax && // Maximum pax check
      this.selectedFoodItem.pax_price >= 0 // Pax price is non-negative
    ) {
      return true;
    } else {
      let errorMessage = 'Please fill in all fields correctly.';
  
      if (!this.selectedFoodItem.food_name) {
        errorMessage = 'Please enter a valid food name.';
      }
  
      if (!this.selectedFoodItem.food_description) {
        errorMessage = 'Please enter a valid food description.';
      }
  
      if (this.selectedFoodItem.minimum_pax < 5) {
        errorMessage = 'Minimum pax must be greater than 4.';
      }
  
      if (this.selectedFoodItem.pax_price < 0) {
        errorMessage = 'Pax price must be a non-negative number.';
      }
  
      if (
        this.selectedFoodItem.maximum_pax !== null &&
        this.selectedFoodItem.minimum_pax > this.selectedFoodItem.maximum_pax
      ) {
        errorMessage = 'Maximum pax must be greater than or equal to minimum pax.';
      }
  
      alert(errorMessage);
    }
    return false;
  }

  limitDigits(event: any, maxLength: number) {
    const input = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (input.length > maxLength) {
      event.target.value = input.substr(0, maxLength);
      event.preventDefault();
    }
  }
  

}*/