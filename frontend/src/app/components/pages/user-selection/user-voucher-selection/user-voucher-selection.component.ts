import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { EventSelectionService } from 'src/app/services/event-selection.service';
import { FoodItemsService } from 'src/app/services/food-items.service'; // Import FoodItemsService


@Component({
  selector: 'app-user-voucher-selection',
  templateUrl: './user-voucher-selection.component.html',
  styleUrls: ['./user-voucher-selection.component.css']
})
export class UserVoucherSelectionComponent {
  catererUid: string;
  voucherItems: Observable<any[]>;

  selectedVoucherItems: any[] = []; // Array to store selected voucher items

  selectedVoucher: any; // Variable to store the selected voucher
  selectedFoodItemsCount: number = 0; // Counter for selected food items
  isVoucherEnabled: boolean = false; // Flag to determine if the voucher is enabled

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private eventSelectionService: EventSelectionService,
    private selectedItemsService: FoodItemsService // Inject FoodItemsService
    ) {
    // Subscribe to the selectedVoucherItems$ observable to get updates
    this.eventSelectionService.selectedVoucherItems$.subscribe((selectedVoucherItems) => {
      this.selectedVoucherItems = selectedVoucherItems;
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.catererUid = params['catererUid'];
      this.loadVoucherItems(); // Fetch voucher data
    });

    // Subscribe to the selectedVoucher$ observable to get updates
    this.eventSelectionService.selectedVoucher$.subscribe((selectedVoucher) => {
      this.selectedVoucher = selectedVoucher;
      this.checkVoucherAvailability();
    });

    // Subscribe to the selectedFoodItems$ observable to get updates
    this.eventSelectionService.selectedFoodItems$.subscribe((selectedFoodItems) => {
      this.selectedFoodItemsCount = selectedFoodItems.length;
      this.checkVoucherAvailability();
    });
  }

  loadVoucherItems() {
    const collectionPath = `caterers/${this.catererUid}/voucherItems`; // Adjust the path accordingly
    this.voucherItems = this.firestore.collection(collectionPath).valueChanges();
  }

  vouchertoggleDescription(voucherItem: any): void {
    voucherItem.showFullDescription = !voucherItem.showFullDescription;
  }

  toggleVoucherSelection(voucherItem: any): void {
    voucherItem.selected = !voucherItem.selected;

    // Check if the voucher item is selected and add/remove it from the array
    if (voucherItem.selected) {
      this.selectedVoucherItems.push(voucherItem);
    } else {
      this.selectedVoucherItems = this.selectedVoucherItems.filter((item) => item !== voucherItem);
    }

    // Save selected voucher items to the service
    this.eventSelectionService.setSelectedVoucherItems(this.selectedVoucherItems);
  }

  // Method to check if the voucher should be enabled
  checkVoucherAvailability(): void {
    if (this.selectedVoucher) {
      const { voucherType, itemQuantity } = this.selectedVoucher;

      if (voucherType === 'Food Item' && this.selectedFoodItemsCount >= itemQuantity) {
        this.isVoucherEnabled = true;
      } else {
        this.isVoucherEnabled = false;
      }
    }
  }

// Method to check if a specific voucher item should be enabled
isVoucherItemEnabled(voucherItem: any, callback: (enabled: boolean) => void): void {
  // Implement the logic based on the voucher conditions
  if (voucherItem.voucherType === 'Food Item') {
    // Check if the user has selected at least the specified itemQuantity
    this.selectedItemsService.selectedItems$.subscribe((selectedFoodItems) => {
      callback(selectedFoodItems.length >= voucherItem.itemQuantity);
    });
  } else {
    // Handle conditions for other voucher types if needed
    callback(true); // For other voucher types, enable the voucher by default
  }
}
}
