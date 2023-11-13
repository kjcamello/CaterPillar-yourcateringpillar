import { Component, OnInit, Input, HostListener} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
//import { FoodItemsService } from 'src/app/services/food-items.service';
//import { ViewFoodItemTable } from 'src/app/components/pages/view-food-item-table';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

//import { tap, catchError } from 'rxjs/operators'; // Import these operators
//import { switchMap } from 'rxjs/operators';
/*
interface FoodCategory {
  categoryName: string;
  items: FoodItem[];
}*/

@Component({
  selector: 'app-diy-package',
  templateUrl: './diy-package.component.html',
  styleUrls: ['./diy-package.component.css']
})
export class DiyPackageComponent implements OnInit {
  @Input() category: string;

  showFoodItemForm: boolean = false;
  newFoodItem: FoodItem = new FoodItem();
  errorMessage: string = null;

  //savedFoodItems: Observable<FoodItem[]> = null;

 // editMode: boolean = false;
//editingFoodItem: FoodItem = new FoodItem();


 //catering: Catering[] = [];
  foodItemForm: FormGroup;
  selectedFoodItems: FoodItem[] = []; // Define a property for selected food items
  //grandTotal: number = 0;
  //showEReceiptForm: boolean = false;
  catererId: string;

  caterer: any; // To store the caterer data
  //savedFoodItems$: Observable<FoodCategory[]>;

  items: FoodItem[] = [];

  //from food-items.component
  selectedCategory: string = 'Main Course';
  foodItems: any[] = []; // To store the retrieved items

  //event form (SPRINT 4)
  showEventForm: boolean = false;
  eventName: string = '';
  eventDescription: string = '';
  eventForm: FormGroup;

    //voucher form (SPRINT 4)
  showVoucherForm: boolean = false;
  voucherName: string = '';
  voucherDescription: string = '';
  voucherImage: string | ArrayBuffer = ''; // Change the type according to your needs
  voucherRequirements: number = 0;
  voucherAmountDeduction: number = 0;
  voucherForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    //private foodItemsService: FoodItemsService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.foodItemForm = this.formBuilder.group({
      food_name: new FormControl('', Validators.required),
      food_description: new FormControl('', Validators.required),
    });

    // Extract the catererId from the route parameters
    this.activatedRoute.params.subscribe((params) => {
      this.catererId = params['id'];

       // Initialize the event form (SPRINT 4)
    this.eventForm = this.formBuilder.group({
      eventName: new FormControl('', Validators.required),
      eventDescription: new FormControl('', Validators.required),  
    });

        // Initialize the voucher form (SPRINT 4)
    this.voucherForm = this.formBuilder.group({
      voucherName: new FormControl('', Validators.required),
      voucherDescription: new FormControl('', Validators.required),
      voucherRequirements: new FormControl('', Validators.required),
      voucherAmountDeduction: new FormControl('', Validators.required),
      voucherImage: new FormControl('', Validators.required),
    });

      // Use this catererId to fetch the food items
      //this.fetchFoodItems(this.selectedCategory);
    });
  }

  toggleFoodItemForm() {
    this.showFoodItemForm = !this.showFoodItemForm;
    this.errorMessage = null;
    if (!this.showFoodItemForm) {
      this.newFoodItem = new FoodItem();
    }
  }

ngOnInit(): void {
  //this.loadCategoryItems();
}

//Side-navbar
logout() {
  this.authService.SignOutCaterer();
  // Redirect or handle post-logout logic here
}

//EVENT METHODS SPRINT 4
toggleEventForm() {
  this.showEventForm = !this.showEventForm;
  if (!this.showEventForm) {
    this.eventForm.reset();
  }
}

// EVENT METHODS SPRINT 4
saveEvent() {
  if (this.eventForm.valid) {
    const eventData = this.eventForm.value;

    // Get the current user's UID
    const catererUid = this.authService.getCatererUid();

    // Add the event to Firestore
    this.firestore.collection('caterers').doc(catererUid).collection('eventItems').add({
      ...eventData,  // Spread the form data
    })
    .then(() => {
      alert('Event saved successfully.');
      this.toggleEventForm(); // Close the form after saving
    })
    .catch((error) => {
      alert('Error saving event: ' + error);
    });
  }
}


//VOUCHER METHODS SPRINT 4
toggleVoucherForm() {
  this.showVoucherForm = !this.showVoucherForm;
  if (!this.showVoucherForm) {
    this.voucherForm.reset();
  }
}

// VOUCHER METHODS SPRINT 4
saveVoucher() {
  if (this.voucherForm.valid) {
    const voucherData = this.voucherForm.value;

    // Get the current user's UID
    const catererUid = this.authService.getCatererUid();

    // Add the voucher to Firestore
    this.firestore.collection('caterers').doc(catererUid).collection('voucherItem').add({
      ...voucherData,  // Spread the form data
    })
    .then(() => {
      alert('Voucher saved successfully.');
      this.toggleVoucherForm(); // Close the form after saving
    })
    .catch((error) => {
      alert('Error saving voucher: ' + error);
    });
  }
}

// Adapted from food-item.component.ts
uploadVoucherImage(event: any) {
  const files = event.target.files;

  if (files.length > 0) {
    const selectedFile = files[0];

    if (this.isImageFile(selectedFile)) {
      this.voucherForm.controls['voucherImage'].setValue(selectedFile);

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.voucherForm.controls['voucherImage'].setValue(e.target.result);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      alert('File not uploaded. It must be a .jpg, .jpeg, or .png file.');
      event.target.value = '';
      this.voucherForm.controls['voucherImage'].setValue(null);
    }
  }
}

private isImageFile(file: File): boolean {
  return file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
}

}
/*
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
  }*/



/*
loadCategoryItems() {
      const catererUid = this.authService.getCatererUid();
      const selectedCategory = this.selectedCategory.toLowerCase();
      
      this.firestore
        .collection('caterers')
        .doc(catererUid)
        .collection(`${selectedCategory}Items`)
        .valueChanges()
        .subscribe((items: any[]) => {
          this.foodItems = items;
        });
    }

  }*/