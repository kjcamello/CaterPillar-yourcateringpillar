import { Component, OnInit, Input, HostListener} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
import { FoodItemsService } from 'src/app/services/food-items.service';
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
  eventImage: string | ArrayBuffer = ''; // Change the type according to your needs
  eventForm: FormGroup;

    //extra service form (SPRINT 4)
    showExtraServiceForm: boolean = false;
    esName: string = '';
    esDescription: string = '';
    esImage: string | ArrayBuffer = ''; // Change the type according to your needs
    esMinHours: number = 0;
    esMaxHours: number = 0;
    esPrice: number = 0;   

    esForm: FormGroup;


    //voucher form (SPRINT 4)
  showVoucherForm: boolean = false;
  voucherName: string = '';
  voucherDescription: string = '';
  voucherImage: string | ArrayBuffer = ''; // Change the type according to your needs
  //voucherRequirements: number = 0;
  //voucherEffect: number = 0;
  itemQuantity: number = 0;
  grandTotal: number = 0;
  discount: number = 0;
  amountDeduction: number = 0;   

  voucherForm: FormGroup;

  //voucherRequirementsType: string = ''; // Add this line
  //voucherEffectType: string = ''; // Add this line
 // voucherAmount: number = null; // Add this line

 // Add these properties to your component class
foodItem_itemQuantity: number = 0;
foodItem_grandTotal: number = 0;
foodItem_discount: number = 0;
foodItem_amountDeduction: number = 0;

extraService_itemQuantity: number = 0;
extraService_grandTotal: number = 0;
extraService_discount: number = 0;
extraService_amountDeduction: number = 0;

selectedVoucherType: string = 'foodItem'; // Default selection

 //voucherRequirementsType: string = 'itemQuantity'; // Set a default value
  //voucherEffectType: string = 'discount'; // Set a default value
  
  
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private foodItemsService: FoodItemsService,
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

           // Initialize the extra service form (SPRINT 4)
           this.esForm = this.formBuilder.group({
            esName: new FormControl('', Validators.required),
            esDescription: new FormControl('', Validators.required),
            esImage: new FormControl('', Validators.required),
            esMinHours: new FormControl('', Validators.required),
            esMaxHours: new FormControl('', Validators.required),
            esPrice: new FormControl('', Validators.required),
          });

        // Initialize the voucher form (SPRINT 4)
    this.voucherForm = this.formBuilder.group({
      voucherName: new FormControl('', Validators.required),
      voucherDescription: new FormControl('', Validators.required),
      itemQuantity: new FormControl('', Validators.required),
      grandTotal: new FormControl('', Validators.required),
      discount: new FormControl('', Validators.required),
      amountDeduction: new FormControl('', Validators.required),
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

//--------------------------------------------
  // EXTRA SERVICE METHODS SPRINT 4
  toggleExtraServiceForm() {
    this.showExtraServiceForm = !this.showExtraServiceForm;
    if (!this.showExtraServiceForm) {
      this.resetExtraServiceForm();
    } else {
      this.createNewExtraServiceForm();
    }
  }

  resetExtraServiceForm() {
    this.esForm.reset(); // Reset the entire form
    this.resetExtraServiceFields();
  }

  createNewExtraServiceForm() {
    this.esForm = this.formBuilder.group({
      esName: new FormControl('', Validators.required),
      esDescription: new FormControl('', Validators.required),
      esImage: new FormControl('', Validators.required),
      esMinHours: new FormControl('', Validators.required),
      esMaxHours: new FormControl('', Validators.required),
      esPrice: new FormControl('', Validators.required),
    });
    this.resetEventFields();
  }

  resetExtraServiceFields() {
    this.esName = ''; // If you have separate variables for these fields, reset them as well
    this.esDescription = '';
    // Reset other fields as needed
    this.esName = '';
    this.esDescription = '';
    this.esImage = '';
    this.esMinHours = null;
    this.esMaxHours = null;
    this.esPrice = null; 
  }

    //voucher image




// Adapted from food-item.component.ts
uploadExtraServiceImage(event: any) {
  const files = event.target.files;
  
  if (files.length > 0) {
    // Image is uploaded
    const selectedFile = files[0];

    if (this.isImageFile(selectedFile)) {
      this.errorMessage = ''; // Clear any previous error message
      this.esImage = selectedFile;

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.esImage = e.target.result;
      };

      reader.readAsDataURL(selectedFile);
    } else {
      this.errorMessage = 'File not uploaded. It must be a .jpg, .jpeg, or .png file.';
      alert(this.errorMessage);

      event.target.value = '';
      this.esImage = null;
    }
  } else {
    // Image is not uploaded, set the default Firebase Storage URL
    this.esImage = 'https://firebasestorage.googleapis.com/v0/b/caterpillar-hestia.appspot.com/o/_images%2Fdefault_no_image.png?alt=media&token=c8be7d38-a9e9-47a2-9cb8-5e6bdf3d4758';

    // Ensure the default image is displayed immediately
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.esImage = e.target.result;
    };
    reader.readAsDataURL(new Blob());
  }
}

  // EVENT METHODS SPRINT 4
  saveExtraServiceItem() {
    if (this.extraserviceConfirmationPrompt()) {
      if (this.validateExtraServiceFields()) {
        this.foodItemsService.saveExtraServiceItem({
          esName: this.esName,
          esDescription: this.esDescription,
          esImage: this.esImage,
          esMinHours: this.esMinHours,
          esMaxHours: this.esMaxHours,
          esPrice: this.esPrice,
        });
        // Reset the form or perform other actions as needed
        this.esForm.reset();
        this.showExtraServiceForm = false;
      }
    }
  }

// Validate extra service form fields
private validateExtraServiceFields(): boolean {
  if (
    this.esName.trim() !== '' &&
    this.esDescription.trim() !== '' &&
    //this.esImage.trim() !== '' &&  // Assuming esImage is a required field
    this.esMinHours !== null &&   // Assuming esMinHours is a required field
    this.esMaxHours !== null &&   // Assuming esMaxHours is a required field
    this.esPrice !== null         // Assuming esPrice is a required field
    // Add other required extra service fields as needed
  ) {
    return true;
  } else {
    alert('Please fill in all extra service fields correctly.');
    return false;
  }
}



  // Event confirmation prompt
  private extraserviceConfirmationPrompt(): boolean {
    if (this.validateExtraServiceFields()) {
      const confirm = window.confirm('Are you sure you want to add this extra service to your catering service?');
      return confirm;
    }
    return false;
  }

//--------------------------------------------
  // EVENT METHODS SPRINT 4
  toggleEventForm() {
    this.showEventForm = !this.showEventForm;
    if (!this.showEventForm) {
      this.resetEventForm();
    } else {
      this.createNewEventForm();
    }
  }

  resetEventForm() {
    this.eventForm.reset(); // Reset the entire form
    this.resetEventFields();
  }

  createNewEventForm() {
    this.eventForm = this.formBuilder.group({
      eventName: new FormControl('', Validators.required),
      eventDescription: new FormControl('', Validators.required),
      // Add other form controls as needed
    });
    this.resetEventFields();
  }

  resetEventFields() {
    this.eventName = ''; // If you have separate variables for these fields, reset them as well
    this.eventDescription = '';
    // Reset other fields as needed
  }

  // EVENT METHODS SPRINT 4
  saveEventItem() {
    if (this.eventConfirmationPrompt()) {
      if (this.validateEventFields()) {
        this.foodItemsService.saveEventItem({
          eventName: this.eventName,
          eventDescription: this.eventDescription,
          // Add other fields as needed
        });
        // Reset the form or perform other actions as needed
        this.eventForm.reset();
        this.showEventForm = false;
      }
    }
  }

  // Validate event form fields
private validateEventFields(): boolean {
  if (
    this.eventName.trim() !== '' &&
    this.eventDescription.trim() !== ''
    // Add other required fields as needed
  ) {
    return true;
  } else {
    alert('Please fill in all event fields correctly.');
    return false;
  }
}

  // Event confirmation prompt
  private eventConfirmationPrompt(): boolean {
    if (this.validateEventFields()) {
      const confirm = window.confirm('Are you sure you want to add this event to your catering service?');
      return confirm;
    }
    return false;
  }

//--------------------------------------------
//VOUCHER
  // VOUCHER METHODS SPRINT 4
  toggleVoucherForm() {
    this.showVoucherForm = !this.showVoucherForm;
    if (!this.showVoucherForm) {
      this.resetVoucherForm();
    } else {
      this.createNewVoucherForm();
    }
  }

  resetVoucherForm() {
    this.voucherForm.reset(); // Reset the entire form
    this.resetVoucherFields();
  }

// Reset voucher fields based on the selected voucher type
resetVoucherFields() {
  this.voucherName = ''; // If you have separate variables for these fields, reset them as well
  this.voucherDescription = '';
  this.foodItem_itemQuantity = null;
  this.foodItem_grandTotal = null;
  this.foodItem_discount = null;
  this.foodItem_amountDeduction = null;
  this.extraService_itemQuantity = null;
  this.extraService_grandTotal = null;
  this.extraService_discount = null;
  this.extraService_amountDeduction = null;
  // Reset other fields as needed
}

// Create a new voucher form based on the selected voucher type
createNewVoucherForm() {
  this.voucherForm = this.formBuilder.group({
    voucherName: new FormControl('', Validators.required),
    voucherDescription: new FormControl('', Validators.required),
    // Add other common form controls as needed
  });

  if (this.selectedVoucherType === 'foodItem') {
    // Add form controls specific to Food Item
    this.voucherForm.addControl('itemQuantity', new FormControl('', Validators.required));
    this.voucherForm.addControl('grandTotal', new FormControl('', Validators.required));
    this.voucherForm.addControl('discount', new FormControl('', Validators.required));
    this.voucherForm.addControl('amountDeduction', new FormControl('', Validators.required));
  } else if (this.selectedVoucherType === 'extraService') {
    // Add form controls specific to Extra Service
    // Adjust this part based on the actual form controls needed for Extra Service
    this.voucherForm.addControl('extraServiceProperty1', new FormControl('', Validators.required));
    this.voucherForm.addControl('extraServiceProperty2', new FormControl('', Validators.required));
    // Add other form controls as needed
  }

  this.resetVoucherFields();
}

  //voucher image




// Adapted from food-item.component.ts
uploadVoucherImage(event: any) {
  const files = event.target.files;
  
  if (files.length > 0) {
    // Image is uploaded
    const selectedFile = files[0];

    if (this.isImageFile(selectedFile)) {
      this.errorMessage = ''; // Clear any previous error message
      this.voucherImage = selectedFile;

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.voucherImage = e.target.result;
      };

      reader.readAsDataURL(selectedFile);
    } else {
      this.errorMessage = 'File not uploaded. It must be a .jpg, .jpeg, or .png file.';
      alert(this.errorMessage);

      event.target.value = '';
      this.voucherImage = null;
    }
  } else {
    // Image is not uploaded, set the default Firebase Storage URL
    this.voucherImage = 'https://firebasestorage.googleapis.com/v0/b/caterpillar-hestia.appspot.com/o/_images%2Fdefault_no_image.png?alt=media&token=c8be7d38-a9e9-47a2-9cb8-5e6bdf3d4758';

    // Ensure the default image is displayed immediately
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.voucherImage = e.target.result;
    };
    reader.readAsDataURL(new Blob());
  }
}

private isImageFile(file: File): boolean {
  return file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
}

// Update the saveVoucherItem method to use a single property for requirements and effect
saveVoucherItem() {
  if (this.voucherConfirmationPrompt()) {
    if (this.validateVoucherFields()) {
      const voucherType = this.selectedVoucherType === 'foodItem' ? 'Food Item' : 'Extra Service';
      const itemQuantity = voucherType === 'Food Item' ? this.foodItem_itemQuantity : this.extraService_itemQuantity;
      const grandTotal = voucherType === 'Food Item' ? this.foodItem_grandTotal : this.extraService_grandTotal;
      const discount = voucherType === 'Food Item' ? this.foodItem_discount : this.extraService_discount;
      const amountDeduction = voucherType === 'Food Item' ? this.foodItem_amountDeduction : this.extraService_amountDeduction;

      this.foodItemsService.saveVoucherItem({
        voucherType: voucherType,
        voucherName: this.voucherName,
        voucherDescription: this.voucherDescription,
        voucherImage: this.voucherImage,
        itemQuantity: itemQuantity,
        grandTotal: grandTotal,
        discount: discount,
        amountDeduction: amountDeduction,
        // Add other fields as needed
      });

      // Reset the form or perform other actions as needed
      this.voucherForm.reset();
      this.showVoucherForm = false;
    }
  }
}
// Validate voucher form fields
private validateVoucherFields(): boolean {
  const isVoucherNameFilled = this.voucherName.trim() !== '';
  const isVoucherDescriptionFilled = this.voucherDescription.trim() !== '';

  if (isVoucherNameFilled && isVoucherDescriptionFilled) {
    if (this.selectedVoucherType === 'foodItem') {
      const isItemQuantityFilled = this.foodItem_itemQuantity !== null && this.foodItem_itemQuantity !== undefined;
      const isGrandTotalFilled = this.foodItem_grandTotal !== null && this.foodItem_grandTotal !== undefined;
      const isDiscountFilled = this.foodItem_discount !== null && this.foodItem_discount !== undefined;
      const isAmountDeductionFilled = this.foodItem_amountDeduction !== null && this.foodItem_amountDeduction !== undefined;

      if ((isItemQuantityFilled || isGrandTotalFilled) && (isDiscountFilled || isAmountDeductionFilled)) {
        return true;
      } else {
        this.displayVoucherValidationError(isItemQuantityFilled, isGrandTotalFilled, isDiscountFilled, isAmountDeductionFilled);
        return false;
      }
    } else if (this.selectedVoucherType === 'extraService') {
      const isExtraServiceItemQuantityFilled = this.extraService_itemQuantity !== null && this.extraService_itemQuantity !== undefined;
      const isExtraServiceGrandTotalFilled = this.extraService_grandTotal !== null && this.extraService_grandTotal !== undefined;
      const isExtraServiceDiscountFilled = this.extraService_discount !== null && this.extraService_discount !== undefined;
      const isExtraServiceAmountDeductionFilled = this.extraService_amountDeduction !== null && this.extraService_amountDeduction !== undefined;

      if ((isExtraServiceItemQuantityFilled || isExtraServiceGrandTotalFilled) && (isExtraServiceDiscountFilled || isExtraServiceAmountDeductionFilled)) {
        return true;
      } else {
        this.displayVoucherValidationError(isExtraServiceItemQuantityFilled, isExtraServiceGrandTotalFilled, isExtraServiceDiscountFilled, isExtraServiceAmountDeductionFilled);
        return false;
      }
    }
  }

  // If no specific conditions are met, display a general error message
  alert('Please fill in all voucher fields correctly.');
  return false;
}


// Display voucher validation error
private displayVoucherValidationError(
  isItemQuantityFilled: boolean,
  isGrandTotalFilled: boolean,
  isDiscountFilled: boolean,
  isAmountDeductionFilled: boolean
): void {
  let errorMessage = 'Please fill in all voucher fields correctly.\n';

  if (!isItemQuantityFilled && !isGrandTotalFilled) {
    errorMessage += '- Please fill in at least one of the fields from Item Quantity and Grand Total.\n';
  }

  if (!isDiscountFilled && !isAmountDeductionFilled) {
    errorMessage += '- Please fill in at least one of the fields from Discount and Amount Deduction.';
  }

  alert(errorMessage);
}

// Voucher confirmation prompt
private voucherConfirmationPrompt(): boolean {
  if (this.validateVoucherFields()) {
    const confirm = window.confirm('Are you sure you want to add this voucher to your catering service?');
    return confirm;
  }
  return false;
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