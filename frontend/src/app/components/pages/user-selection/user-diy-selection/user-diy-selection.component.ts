import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  Observable } from 'rxjs';

import { FoodItemsService } from 'src/app/services/food-items.service';
import { EventSelectionService } from 'src/app/services/event-selection.service';
import { UserAuthService } from 'src/app/services/userauth.service';

import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { AbstractControl } from '@angular/forms'; // Add this line


// Create an interface for the item structure
interface FoodItem {
  foodItemId?: string; // Add this line
  category: string;
  food_name: string;
  selected?: boolean;
  // Define the properties based on your actual data structure
  food_image: string;
  pax_price: number;
  // ... other properties
  minimum_pax?: number;
  selectedPax?: number;
  selectedPaxError?: string;
  showFullDescription?: boolean;
}


@Component({
  selector: 'app-user-diy-selection',
  templateUrl: './user-diy-selection.component.html',
  styleUrls: ['./user-diy-selection.component.css']
})

export class UserDiySelectionComponent implements OnInit {
  catererUid: string;
  mainCourseItems: Observable<any[]>;
  appetizerItems: Observable<any[]>;
  soupItems: Observable<any[]>;
  saladItems: Observable<any[]>;
  dessertItems: Observable<any[]>;
  drinkItems: Observable<any[]>;


  selectedItems: Observable<FoodItem[]>; // Maintain as Observable<FoodItem[]>
  selectedFoodItems: FoodItem[] = []; // Array to track selected items

  selectedCategory: string;

    // Declare a variable to store the selected item
//selectedItem: any;


extraServiceItems: Observable<any[]>;
eventItems: Observable<any[]>;
voucherItems: Observable<any[]>;

//SPRINT 5 LOGIC
selectedEvent: any;//final integration
//SPRINT 5 LOGIC
dateAndTimeForm: FormGroup;
showReceipt: boolean = false; // Add this line for the showReceipt property
  
// Declare a variable to store the selected item
selectedItem: FoodItem | null = null;  // Initialize to null
selectedExtraServices: any[] = []; // Array to store selected extra services

displayName: string | null;


selectedVoucherItems: any[] = []; // Array to store selected voucher items
selectedVoucher: any = null;

// Add this property to store the adjusted grand food item total
adjustedGrandFoodItemTotal: number = 0;
grandTotal: number = 0;

originalTotal: number = 0;

  // Add these properties to store original and new grand totals
  originalGrandTotal: number = 0;
  newGrandTotal: number = 0;


  //modal package name when add-to-cart button is pressed
  showPackageNamePrompt: boolean = false;
packageName: string = '';

    get locationLandmarkControl(): AbstractControl | null {
    return this.dateAndTimeForm.get('locationLandmark');
  }


  //package in add-to-cart
  selectedPackage: any = {}; // Assuming you have a property to store the selected package

  userUid: string = '';  // Declare userUid property
  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private foodItemsService: FoodItemsService,
    private eventSelectionService: EventSelectionService,
    private formBuilder: FormBuilder,
    private selectedItemsService: FoodItemsService,
    private authService: AuthService,
    private userauthService: UserAuthService
    ) {
    // Initialize the form in the constructor
    this.dateAndTimeForm = this.formBuilder.group({
      selectedDate: [null, Validators.required],
      selectedTime: [null, Validators.required],
      locationLandmark: [null, Validators.required],
    });

    this.displayName = authService.getLoggedInUsername();
    }

    //loader of all loads
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.catererUid = params['catererUid'];
        // Provide a default category or choose one based on your use case
        this.loadFoodItems('maincourseItems');
      });
  
      this.eventSelectionService.selectedEvent$.subscribe((selectedEvent) => {
        this.selectedEvent = selectedEvent;
      });
  
      // Subscribe to the selectedExtraService$ observable to get updates
      this.eventSelectionService.selectedExtraServices$.subscribe((selectedExtraServices) => {
        this.selectedExtraServices = selectedExtraServices;
        this.updateEReceipt(); // Call the method to update the e-receipt whenever the selection changes
      });

    // Subscribe to the selectedVoucherItems$ observable to get updates
    this.eventSelectionService.selectedVoucherItems$.subscribe((selectedVoucherItems) => {
      this.selectedVoucherItems = selectedVoucherItems;
    });

    this.userUid = this.userauthService.getUserUid();
  }
  
    loadFoodItems(category: string) {
      this.selectedCategory = category;
    
      // Construct the correct collection path based on the category
      const collectionPath = `caterers/${this.catererUid}/${category}`;
    
      // Specify the type of data expected (FoodItem[])
      this.selectedItems = this.firestore
        .collection<FoodItem>(collectionPath)
        .valueChanges();
    }

  // Method to update the e-receipt based on selectedExtraServices
  updateEReceipt(): void {
    // Implement your logic to update the e-receipt using this.selectedExtraServices
    console.log('Selected Extra Services:', this.selectedExtraServices);

    // Example: Display selected extra services in the console
    this.selectedExtraServices.forEach((extraService) => {
      console.log(`Extra Service: ${extraService.esName}, Hours: ${extraService.selectedHours}`);
    });

    // Add your logic to update the e-receipt UI based on the selected extra services
  }

  foodtoggleDescription(item: any): void {
    item.showFullDescription = !item.showFullDescription;
  }

  estoggleDescription(extraService: any): void {
    extraService.showFullDescription = !extraService.showFullDescription;
  }

  eventtoggleDescription(eventItem: any): void {
    eventItem.showFullDescription = !eventItem.showFullDescription;
  }

  vouchertoggleDescription(voucherItem: any): void {
    voucherItem.showFullDescription = !voucherItem.showFullDescription;
  }

  toggleFoodSelection(item: FoodItem): void {
    console.log('Toggling selection for item:', item);
  
    // Check if the item is already selected in the current category
    const isItemSelected = this.selectedFoodItems.some(selectedItem => selectedItem.foodItemId === item.foodItemId);
  
    // If the item is not selected, set it as the selected item
    // Otherwise, clear the selected item
    this.selectedItem = isItemSelected ? null : item;
  
    // Toggle the 'selected' property of the clicked item
    item.selected = !isItemSelected;
  
    // If the item is selected, initialize selectedPax to minimum_pax
    if (item.selected) {
      item.selectedPax = item.minimum_pax;
    }
  
    // If the item is selected and not in the array, add it to the array
    if (item.selected && !isItemSelected) {
      this.selectedFoodItems.push(item);
    } else if (!item.selected && isItemSelected) {
      // If the item is deselected and in the array, remove it from the array
      this.selectedFoodItems = this.selectedFoodItems.filter(selectedItem => selectedItem.foodItemId !== item.foodItemId);
    }
  
    // Ensure other items are not selected
    this.selectedFoodItems = this.selectedFoodItems.map(otherItem => {
      if (otherItem !== item) {
        return { ...otherItem, selected: false }; // Set 'selected' to false for other items
      }
      return item;
    });
  
    // Save selected items to the service
    this.selectedItemsService.setSelectedItems(this.selectedFoodItems);
  }
  
  
  
  checkAndAdjustPax(item: any): void {
    const newValue = parseInt(item.selectedPax, 10);
  
    // Check if the selectedPax is within the allowed range
    if (newValue < item.minimum_pax || newValue > item.maximum_pax) {
      item.selectedPaxError = `Selected pax should be between ${item.minimum_pax} and ${item.maximum_pax}.`;
      alert(item.selectedPaxError);
      item.selectedPax = item.minimum_pax+1; // Set to minimum pax value
    } else {
      item.selectedPaxError = null;
    }
  }

  toggleReceipt() {
    // Check if there are selected food items
    if (this.selectedFoodItems.length === 0) {
      alert('Please select at least one food item before reviewing the order.');
      return; // Exit the method if there are no selected food items
    }
  
    // Check if the event is selected
    if (!this.selectedEvent) {
      alert('Please select an event before reviewing the order.');
      return; // Exit the method if the event is not selected
    }
  
    // Check if the date and time are set
    if (!this.dateAndTimeForm.get('selectedDate').value) {
      alert('Please set the event date before reviewing the order.');
      return; // Exit the method if the date is not set
    }
  
    if (!this.dateAndTimeForm.get('selectedTime').value) {
      alert('Please set the event time before reviewing the order.');
      return; // Exit the method if the time is not set
    }
  
    // Check if the location is set
    if (!this.dateAndTimeForm.get('locationLandmark').value) {
      alert('Please set the event location before reviewing the order.');
      return; // Exit the method if the location is not set
    }
  
    // If all conditions are met, toggle the receipt display
    this.showReceipt = !this.showReceipt;
  }
  
  
/*event*/
  formatDate(selectedDate: string): string {
    // Use Angular's DatePipe to format the date including the day of the week
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(selectedDate), 'E, MMM d, y');
    return formattedDate || selectedDate;
  }

  formatTime(selectedTime: string): string {
    // Convert the time to 12-hour format with AM and PM
    const [hours, minutes] = selectedTime.split(':');
    const timePeriod = +hours >= 12 ? 'PM' : 'AM';
    const formattedHours = +hours % 12 || 12;
    return `${formattedHours}:${minutes} ${timePeriod}`;
  }

  /*computation prices*/
  /*food items*/
  calculateSubtotal(item: FoodItem): number {
    return item.selectedPax * item.pax_price;
  }

  calculateFoodItemTotal(): number {
    let total = 0;
    for (const item of this.selectedFoodItems) {
      total += this.calculateSubtotal(item);
    }
    return total;
  }

  calculateNewGrandFoodItemTotal(): number {
    // Get the original grand total
    let originalGrandFoodItemTotal = this.calculateFoodItemTotal();
  
    // Log selected voucher items for debugging
    console.log('Selected Voucher Items:', this.selectedVoucherItems);
  
    // Check if any vouchers are selected
    if (this.selectedVoucherItems && this.selectedVoucherItems.length > 0) {
      // Loop through selected vouchers and apply the deduction if selected is true
      this.selectedVoucherItems.forEach((voucherItem) => {
        console.log('Processing Voucher:', voucherItem);
  
        if (voucherItem.selected) {
          // Check if the voucher is food items
          if (voucherItem.voucherType === 'Food Item') {
            // Check if the selected food items meet the voucher item quantity requirement
            if (this.selectedFoodItems.length >= voucherItem.itemQuantity && voucherItem.grandTotal <= originalGrandFoodItemTotal) {
              if (voucherItem.discount !== null) {
                // Apply percentage discount
                const discountPercentage = voucherItem.discount / 100;
                const discountAmount = originalGrandFoodItemTotal * discountPercentage;
                originalGrandFoodItemTotal -= discountAmount;
              } else if (voucherItem.amountDeduction !== null) {
                // Apply fixed amount deduction
                originalGrandFoodItemTotal -= voucherItem.amountDeduction;
              }
            }
            else {
              console.log(`Selected food items do not meet the voucher quantity requirement for ${voucherItem.voucherName}.`);
            }
          }
        }
      });
    }
  
    return originalGrandFoodItemTotal;
  }
  
  
  onVoucherSelectionChanged(selectedVoucherItems: any[]): void {
    this.selectedVoucherItems = selectedVoucherItems;

    // Recalculate the grand total when voucher selection changes
    this.calculateNewGrandFoodItemTotal();

    this.calculateNewGrandExtraServiceTotal();
  }

  /*extra service*/
  calculateExtraServiceSubtotal(extraService: any): number {
    return extraService.selectedHours * extraService.esPrice;
  }

  calculateExtraServiceTotal(): number {
    let total = 0;
    for (const service of this.selectedExtraServices) {
      total += this.calculateExtraServiceSubtotal(service);
    }
    return total;
  }
  

  calculateNewGrandExtraServiceTotal(): number {
    // Get the original grand total
    let originalGrandExtraServiceTotal = this.calculateExtraServiceTotal();
  
    // Log selected voucher items for debugging
    console.log('Selected Voucher Items:', this.selectedVoucherItems);
  
    // Check if any vouchers are selected
    if (this.selectedVoucherItems && this.selectedVoucherItems.length > 0) {
      // Loop through selected vouchers and apply the deduction if selected is true
      this.selectedVoucherItems.forEach((voucherItem) => {
        console.log('Processing Voucher:', voucherItem);
  
        if (voucherItem.selected) {
          // Check if the voucher is extra service
          if (voucherItem.voucherType === 'Extra Service') {
            // Check if the selected extra services meet the voucher item quantity requirement
            if (this.selectedExtraServices.length >= voucherItem.itemQuantity && voucherItem.grandTotal <= originalGrandExtraServiceTotal) {
              if (voucherItem.discount !== null) {
                // Apply percentage discount
                const discountPercentage = voucherItem.discount / 100;
                const discountAmount = originalGrandExtraServiceTotal * discountPercentage;
                originalGrandExtraServiceTotal -= discountAmount;
              } else if (voucherItem.amountDeduction !== null) {
                // Apply fixed amount deduction
                originalGrandExtraServiceTotal -= voucherItem.amountDeduction;
              }
              else {
                console.log(`Selected extra services do not meet the voucher quantity requirement for ${voucherItem.voucherName}.`);
              }
            }
          }
        }
      });
    }
    
  
    return originalGrandExtraServiceTotal;
  }

  // Update the method to calculate the original grand total
  calculateOriginalGrandTotal(): number {
    // Calculate the original grand total by adding the original grand food item total and original grand extra service total
    const originalGrandFoodItemTotal = this.calculateFoodItemTotal();
    const originalGrandExtraServiceTotal = this.calculateExtraServiceTotal();
    this.originalGrandTotal = originalGrandFoodItemTotal + originalGrandExtraServiceTotal;

    // Log for debugging
    console.log('Original Grand Food Item Total:', originalGrandFoodItemTotal);
    console.log('Original Grand Extra Service Total:', originalGrandExtraServiceTotal);
    console.log('Original Grand Total:', this.originalGrandTotal);

    return this.originalGrandTotal;
  }

  // Update the method to calculate the new grand total
  calculateNewGrandTotal(): number {
    // Calculate the new grand total by adding the new grand food item total and new grand extra service total
    const newGrandFoodItemTotal = this.calculateNewGrandFoodItemTotal();
    const newGrandExtraServiceTotal = this.calculateNewGrandExtraServiceTotal();
    this.newGrandTotal = newGrandFoodItemTotal + newGrandExtraServiceTotal;

    // Log for debugging
    console.log('New Grand Food Item Total:', newGrandFoodItemTotal);
    console.log('New Grand Extra Service Total:', newGrandExtraServiceTotal);
    console.log('New Grand Total:', this.newGrandTotal);

    return this.newGrandTotal;
  }


//Add-to-Cart Methods
promptForPackageName(): void {
  this.showPackageNamePrompt = true;
}

cancelAddToCart(): void {
  this.showPackageNamePrompt = false;
  // Additional logic if needed
}

confirmAddToCart(): void {
  // Show a prompt to enter the package name
  const packageName = prompt('Enter the package name:');

  if (packageName !== null) {
    // Package name is entered

    // Show a confirmation prompt
    const isConfirmed = window.confirm('Are you sure you want to add-to-cart this package for now?');

    if (isConfirmed) {
      // Perform the logic to add to cart with the entered package name
      console.log('Added to Cart with Package Name:', packageName);

      // Save to cart
      this.foodItemsService.saveToCart(this.selectedPackage, this.userUid, packageName);

      // Reset values
      this.showPackageNamePrompt = false;
      this.packageName = '';
    }
  } else {
    // Package name is not entered
    alert('Package name is required.');
  }
}

addToCart(): void {
  const userUid = this.userauthService.getUserUid();
  const packageName = this.packageName;  // Make sure packageName is properly set

  if (this.selectedPackage && userUid && packageName) {
    this.foodItemsService.saveToCart(this.selectedPackage, userUid, packageName);
  } else {
    console.error('Missing required data for adding to cart.');
  }
}


}