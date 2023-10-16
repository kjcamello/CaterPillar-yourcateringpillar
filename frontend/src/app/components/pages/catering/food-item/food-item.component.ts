import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoodItem } from 'src/app/shared/models/food-item';
//import { FoodItemService } from 'src/app/services/food-item.service';
import { AuthService } from 'src/app/services/auth.service'; //user auth

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent {
  @Input() foodItem: FoodItem;
  @Output() saveFood: EventEmitter<FoodItem> = new EventEmitter<FoodItem>();

  errorMessage: string = null;

  constructor(private authService: AuthService) {}

  saveFoodItem() {
    this.errorMessage = this.validateFields();

    if (!this.errorMessage) {
      this.authService.saveFoodItem(this.foodItem).then(
        () => {
          this.errorMessage = null;
          this.saveFood.emit(this.foodItem);
          alert('Food item saved successfully.');
        },
        error => {
          this.errorMessage = 'Error saving food item. Please try again.';
          alert(this.errorMessage);
        }
      );
    } else {
      alert(this.errorMessage);
    }
  }

  uploadFoodImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.foodItem.food_image = e.target.result; // Set the base64 data URL to the food_item's image property
      };

      reader.readAsDataURL(file);
    }
  }

  cancelFood() {
    // Reset the form fields to their initial state
    this.foodItem = new FoodItem(); // Assuming FoodItem is your model with default values
  
    // Clear the error message
    this.errorMessage = null;
  
    // You can add additional logic to hide the form if needed
    // For example, if you're using ngIf to show/hide the form in the template, you can set a flag to control its visibility.
    //this.showFoodItemForm = false; // Create a showFoodItemForm property in your component
  }
  

  private validateFields(): string | null {
    if (!this.foodItem.food_name || !this.foodItem.food_description || !this.foodItem.minimum_pax || !this.foodItem.pax_price) {
      return 'Please fill in all fields.';
    }

    if (this.foodItem.minimum_pax <= 4) {
      return 'Minimum Pax value must be greater than 4.';
    }

    return null;
  }
}
