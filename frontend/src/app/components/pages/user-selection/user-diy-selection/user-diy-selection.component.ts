import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-diy-selection',
  templateUrl: './user-diy-selection.component.html',
  styleUrls: ['./user-diy-selection.component.css']
})
export class UserDiySelectionComponent implements OnInit {
  catering: Catering[] = [];
  foodItems: Observable<FoodItem[]>; // Updated data type
  foodItemForm: FormGroup;

  // Define a property for selected food items
  selectedFoodItems: FoodItem[] = [];

  caterer: any; // To store the caterer data

  // Add a property for the grand total
  grandTotal: number = 0;

   // Property to control the display of the e-receipt form
  showEReceiptForm: boolean = false;

  constructor(
    private cateringservice: CateringService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore // Angular Firestore injection
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
        this.catering = this.cateringservice.getAll();
      }
    });
  }

  ngOnInit(): void {
    this.foodItems = this.firestore.collection<FoodItem>('foodItems').valueChanges();

    // Fetch caterer data
    this.authService.currentEmail.subscribe((email) => {
      if (email) {
        this.fetchCatererData(email);
      }
    });
  }

    // Function to toggle the display of the e-receipt form
    toggleEReceiptForm() {
      this.showEReceiptForm = !this.showEReceiptForm;
    }

  //lopez Sprint 2
  fetchCatererData(email: string) {
    // Modify this method to fetch caterer data with catering info from Firestore
    // Fetch the caterer document based on the email (you might need a specific field)
    this.firestore
      .collection('caterers', (ref) => ref.where('email', '==', email))
      .valueChanges()
      .subscribe((catererData) => {
        if (catererData.length > 0) {
          this.caterer = catererData[0];
        }
      });
  }
  
// Function to update the grand total based on selected items
updateGrandTotal(selectedFoodItems: FoodItem[]) {
  this.grandTotal = this.selectedFoodItems.reduce((total, item) => {
    return total + item.pax_price * item.selectedPax;
  }, 0);
}

handleCheckboxChange(foodItem: FoodItem) {
  // Update the selectedPax for the food item when its checkbox changes
  foodItem.selected = !foodItem.selected;

  if (foodItem.selected) {
    // Add the selected item to the array
    this.selectedFoodItems.push(foodItem);
  } else {
    // Remove the selected item from the array
    this.selectedFoodItems = this.selectedFoodItems.filter(
      (item) => item !== foodItem
    );
  }

  // Update the grand total when the selection changes
  this.updateGrandTotal(this.selectedFoodItems);
}

updateTotalPrice(foodItem: FoodItem, newValue: number) {
  if (newValue < foodItem.minimum_pax) {
    alert('Selected pax must be greater than or equal to minimum pax.');
    foodItem.selectedPax = foodItem.minimum_pax;
  } else {
    // Convert the selectedPax input to a number
    const selectedPax = +newValue;

    // Calculate the total for the specific food item
    const itemTotal = foodItem.pax_price * selectedPax;

    // Update the selectedPax value for this food item
    foodItem.selectedPax = selectedPax;

    if (foodItem.selected) {
      // Update the grandTotal with the total for this item only
      this.grandTotal += itemTotal;
    }

    // Ensure that the grandTotal remains positive
    if (this.grandTotal < 0) {
      this.grandTotal = 0;
    }
  }
}

}

/*addToSelectedFoodItems(foodItem: FoodItem) {
  if (foodItem.selectedPax >= foodItem.minimum_pax) {
    if (!foodItem.selected) {
      foodItem.selected = true;
      const itemTotal = foodItem.pax_price * foodItem.selectedPax;
      this.grandTotal += itemTotal;
    } else {
      // If the item is already selected, don't accumulate the total
    }
  } else {
    // If the minimum pax requirement is not met, show an alert error
    alert('Selected pax must be greater than or equal to minimum pax.');

    // Set the grand total for this item to 0
    this.grandTotal -= foodItem.pax_price * foodItem.selectedPax;

    // Reset the selectedPax to the minimum pax
    foodItem.selectedPax = foodItem.minimum_pax;
  }
}



  
  
}
*/
