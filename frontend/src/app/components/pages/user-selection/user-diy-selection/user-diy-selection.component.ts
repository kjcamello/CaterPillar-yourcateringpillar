import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { EventSelectionService } from 'src/app/services/event-selection.service';

import { DatePipe } from '@angular/common';

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


  selectedItems: Observable<any[]>;
  selectedCategory: string;

    // Declare a variable to store the selected item
selectedItem: any;


extraServiceItems: Observable<any[]>;
eventItems: Observable<any[]>;
voucherItems: Observable<any[]>;

//SPRINT 5 LOGIC
selectedEvent: any;
//SPRINT 5 LOGIC
dateAndTimeForm: FormGroup;
showReceipt: boolean = false; // Add this line for the showReceipt property
  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private eventSelectionService: EventSelectionService,
    private formBuilder: FormBuilder
    ) {
    // Initialize the form in the constructor
    this.dateAndTimeForm = this.formBuilder.group({
      selectedDate: [null, Validators.required],
      selectedTime: [null, Validators.required],
    });
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

  }

  loadFoodItems(category: string) {
    this.selectedCategory = category;

    // Construct the correct collection path based on the category
    const collectionPath = `caterers/${this.catererUid}/${category}`;

    this.selectedItems = this.firestore
      .collection(collectionPath)
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

  
  toggleFoodSelection(item: any): void {
    // Toggle the 'selected' property of the clicked item
    item.selected = !item.selected;
  
    // If the item is selected, initialize selectedPax to minimum_pax
    if (item.selected) {
      item.selectedPax = item.minimum_pax;
      this.selectedItems.forEach((otherItem) => {
        if (otherItem !== item) {
          // Ensure 'selected' property exists on the item before setting it to false
          if ('selected' in otherItem) {
            otherItem.selected = false;
          }
        }
      });
    }
  }
  /*
  checkPaxRange(item: any, newValue: number): void {
    // Check if the selectedPax is within the allowed range    if (newValue < item.minimum_pax || newValue > item.maximum_pax) {
      item.selectedPaxError = `Selected pax should be between ${item.minimum_pax} and ${item.maximum_pax}.`;
      item.selectedPax = item.minimum_pax; // Set to minimum pax value
      alert(item.selectedPaxError);
    } else {
      item.selectedPaxError = null;
    }
  }*/
  
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
  
}