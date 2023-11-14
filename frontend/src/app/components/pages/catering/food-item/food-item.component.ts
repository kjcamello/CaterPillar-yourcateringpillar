import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FoodItem } from 'src/app/shared/models/food-item';
import { FoodItemsService } from 'src/app/services/food-items.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent {
  foodItem: FoodItem = new FoodItem(); // Initialize the foodItem object
  //@Input() foodItem: FoodItem = new FoodItem();
  errorMessage: string;
  //confirmationPrompt: boolean = false; // Declare the confirmationPrompt property
  //@ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private foodItemsService: FoodItemsService,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
  }

  saveFoodItem() {
    if (this.confirmationPrompt()) {
      if (this.foodItem.category) {
        const subcollectionName = this.getSubcollectionForCategory(this.foodItem.category);
  
        if (subcollectionName) {
          const foodItemData = this.foodItemsService.toObject(this.foodItem);
  
          const catererUid = this.authService.getCatererUid();
  
          if (catererUid) {
            const subcollectionRef = this.firestore.collection(`caterers/${catererUid}/${subcollectionName}`);
            
            // Generate a unique ID for the food item (foodItemId)
            const foodItemId = this.firestore.createId();
            // Add catererUid and foodItemId to the foodItemData
            foodItemData.catererUid = catererUid;
            foodItemData.foodItemId = foodItemId;
  
            subcollectionRef.doc(foodItemId).set(foodItemData)
            .then(() => {
              alert('Food item saved successfully.');
              this.resetFoodItemFields(); // Call the method to reset the food item fields
            })
              .catch(error => {
                alert('Error saving food item: ' + error.message);
              });
          } else {
            alert('No caterer UID available. Caterer is not logged in.');
          }
        } else {
          alert('Invalid category selected.');
        }
      } else {
        alert('Category not set in foodItem.');
      }
    }
  }

  // Inside your FoodItemComponent class
resetFoodItemFields() {
  this.foodItem = new FoodItem(); // Reset the food item to a new instance
  this.foodItem.food_image = 'https://firebasestorage.googleapis.com/v0/b/caterpillar-hestia.appspot.com/o/_images%2Fdefault_no_image.png?alt=media&token=c8be7d38-a9e9-47a2-9cb8-5e6bdf3d4758';

    // Reset the file input field
  //  this.fileInput.nativeElement.value = '';
}
  
  
  confirmationPrompt() {
    if (this.validateFields()) {
      const confirm = window.confirm('Are you sure you want to add this food item to your catering service? NOTE: You can still update the item, but you cannot update the category anymore.');
      return confirm;
    }
    return false;
  }
  
validateFields() {
  if (
    this.foodItem.food_name &&
    this.foodItem.food_description &&
    this.foodItem.minimum_pax !== null &&
    this.foodItem.pax_price !== null &&
    this.foodItem.maximum_pax !== null &&
    (this.foodItem.category !== null && this.foodItem.category !== '') &&
    this.foodItem.minimum_pax >= 5 && // Minimum pax check
    this.foodItem.minimum_pax <= this.foodItem.maximum_pax && // Maximum pax check
    this.foodItem.pax_price >= 0 // Pax price is non-negative
  ) {
    return true;
  } else {
    let errorMessage = 'Please fill in all fields correctly.';

    if (this.foodItem.minimum_pax < 5) {
      errorMessage = 'Minimum pax must be greater than 4.';
    }

    if (this.foodItem.pax_price < 0) {
      errorMessage = 'Pax price must be a non-negative number.';
    }

    if (this.foodItem.maximum_pax !== null && this.foodItem.minimum_pax > this.foodItem.maximum_pax) {
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


  private getSubcollectionForCategory(category: string): string | null {
    switch (category) {
      case 'Main Course':
        return 'maincourseItems';
      case 'Appetizer':
        return 'appetizerItems';
      case 'Soup':
        return 'soupItems';
      case 'Salad':
        return 'saladItems';
      case 'Dessert':
        return 'dessertItems';
      case 'Drink':
        return 'drinkItems';
      default:
        return null;
    }
  }
  

  uploadFoodImage(event: any) {
    const files = event.target.files;
  
    if (files.length > 0) {
      // Image is uploaded
      const selectedFile = files[0];
  
      if (this.isImageFile(selectedFile)) {
        this.errorMessage = ''; // Clear any previous error message
        this.foodItem.food_image = selectedFile;
  
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.foodItem.food_image = e.target.result;
        };
  
        reader.readAsDataURL(selectedFile);
      } else {
        this.errorMessage = 'File not uploaded. It must be a .jpg, .jpeg, or .png file.';
        alert(this.errorMessage);
  
        event.target.value = '';
        this.foodItem.food_image = null;
      }
    } else {
      // Image is not uploaded, set the default Firebase Storage URL
      this.foodItem.food_image = 'https://firebasestorage.googleapis.com/v0/b/caterpillar-hestia.appspot.com/o/_images%2Fdefault_no_image.png?alt=media&token=c8be7d38-a9e9-47a2-9cb8-5e6bdf3d4758';
  
      // Ensure the default image is displayed immediately
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.foodItem.food_image = e.target.result;
      };
      reader.readAsDataURL(new Blob());
    }
  }
  
  private isImageFile(file: File): boolean {
    return file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
  }
  
  
}



  
/*
  getSubcollectionForCategory(category: string) {
    switch (category) {
      case 'Main Course':
        return 'maincourseItems';
      case 'Appetizer':
        return 'appetizerItems';
      case 'Soup':
        return 'soupItems';
      case 'Salad':
        return 'saladItems';
      case 'Dessert':
        return 'dessertItems';
      case 'Drink':
        return 'drinkItems';
      default:
        return null;
    }
  }*/