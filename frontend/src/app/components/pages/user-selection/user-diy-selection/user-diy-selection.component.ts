import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { FoodItemsService } from 'src/app/services/food-items.service';
import { EventSelectionService } from 'src/app/services/event-selection.service';


import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

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
selectedEvent: any;
//SPRINT 5 LOGIC
dateAndTimeForm: FormGroup;
showReceipt: boolean = false; // Add this line for the showReceipt property
  
// Declare a variable to store the selected item
selectedItem: FoodItem | null = null;  // Initialize to null
selectedExtraServices: any[] = []; // Array to store selected extra services

displayName: string | null;
constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private eventSelectionService: EventSelectionService,
    private formBuilder: FormBuilder,
    private selectedItemsService: FoodItemsService,
    private authService: AuthService
    ) {
    // Initialize the form in the constructor
    this.dateAndTimeForm = this.formBuilder.group({
      selectedDate: [null, Validators.required],
      selectedTime: [null, Validators.required],
    });

    this.displayName = authService.getLoggedInUsername();
    }

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


  loadFoodItems(category: string) {
    this.selectedCategory = category;
  
    // Construct the correct collection path based on the category
    const collectionPath = `caterers/${this.catererUid}/${category}`;
  
    // Specify the type of data expected (FoodItem[])
    this.selectedItems = this.firestore
      .collection<FoodItem>(collectionPath)
      .valueChanges();
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
  if (!this.dateAndTimeForm.valid) {
    alert('Please set the event date and time before reviewing the order.');
    return; // Exit the method if date and time are not set
  }
  
    // If all conditions are met, toggle the receipt display
    this.showReceipt = !this.showReceipt;
  }
  

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
  
  calculateSubtotal(item: FoodItem): number {
    return item.selectedPax * item.pax_price;
  }

  calculateGrandTotal(): number {
    const foodItemTotal = this.calculateFoodItemTotal();
    const extraServiceTotal = this.calculateExtraServiceTotal();
    return foodItemTotal + extraServiceTotal;
  }

  calculateExtraServiceSubtotal(extraService: any): number {
    return extraService.selectedHours * extraService.esPrice;
  }
  
  calculateFoodItemTotal(): number {
    let total = 0;
    for (const item of this.selectedFoodItems) {
      total += this.calculateSubtotal(item);
    }
    return total;
  }

  calculateExtraServiceTotal(): number {
    let total = 0;
    for (const service of this.selectedExtraServices) {
      total += this.calculateExtraServiceSubtotal(service);
    }
    return total;
  }
  
}