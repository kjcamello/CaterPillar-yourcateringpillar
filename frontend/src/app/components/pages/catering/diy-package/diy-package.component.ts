import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
//import { FoodItemsService } from 'src/app/services/food-items.service';
//import { ViewFoodItemTable } from 'src/app/components/pages/view-food-item-table';

//import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
//import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    //private firestore: AngularFirestore,
    //private authService: AuthService,
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

logout() {
  this.authService.SignOutCaterer();
  // Redirect or handle post-logout logic here
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



    // For debugging: check if the user is authenticated and has a caterer ID
  /*console.log('Authenticated:', this.authService.CatererisLoggedIn);
  console.log('Caterer ID:', this.authService.getCatererUid());

  this.fetchFoodItems(this.selectedCategory);*/

  /*
    // Add stub methods for Update and Delete
    updateFoodItem(item: FoodItem) {
      // Implement the update functionality here
    }
  
    deleteFoodItem(item: FoodItem) {
      // Implement the delete functionality here
    }*/