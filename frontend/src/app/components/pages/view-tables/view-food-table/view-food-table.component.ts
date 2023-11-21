import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-food-table',
  templateUrl: './view-food-table.component.html',
  styleUrls: ['./view-food-table.component.css']
})
export class ViewFoodTableComponent implements OnInit {
  selectedTab: string = '';
  foodItems: any[] = [];

  //when selected
  selectedFoodItem: any = null;
  selectedCategory: string = 'Food';

  // Add a property to track the edited row
  editedRowIndex: number = -1;

  showUpdateFoodItemForm: boolean = false;
  errorMessage: string = null;
  noItems: boolean = false;
  
//SPRINT 4
searchText: string = '';

searchMinPax: string = '';
  searchMaxPax: string = '';
  searchPaxPrice: string = '';

sortDirection: 'asc' | 'desc' = 'asc'; // Initial sorting direction

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadCategoryItems();
  }

  loadCategoryItems() {
    const catererUid = this.authService.getCatererUid();
    const selectedCategory = this.selectedTab.toLowerCase();

    this.firestore
      .collection('caterers')
      .doc(catererUid)
      .collection(`${selectedCategory}Items`)
      .valueChanges()
      .subscribe(
        (items: any[]) => {
          console.log('Fetched items:', items);
          this.foodItems = items;
        },
        (error) => {
          console.error('Error fetching items:', error);
        }
      );
  }

  selectTab(category: string) {
    this.selectedTab = category;
    this.selectedCategory = category.toLowerCase();
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.classList.remove('selected');
    });
    const selectedTab = document.querySelector(`.tab[data-category="${category}"]`);
    if (selectedTab) {
      selectedTab.classList.add('selected');
    }

    this.loadCategoryItems();
  }

  deleteFoodItem(foodItem: any): void {
    const catererUid = this.authService.getCatererUid();
    const selectedCategory = this.selectedCategory.toLowerCase();
    const foodItemId = foodItem.foodItemId;

    const isConfirmed = window.confirm('Are you sure you want to delete this food item?');

    if (isConfirmed) {
      if (catererUid && selectedCategory && foodItemId) {
        const docRef = this.firestore.doc(`caterers/${catererUid}/${selectedCategory}Items/${foodItemId}`);

        docRef.delete().then(() => {
          this.foodItems = this.foodItems.filter(item => item.foodItemId !== foodItemId);
          alert('Food item deleted successfully.');
        }).catch(error => {
          alert('An error occurred while deleting the food item. Please try again later.');
          console.error('Error deleting food item:', error);
        });
      } else {
        alert('Invalid parameters for deleting food item.');
      }
    } else {
      console.log('Deletion cancelled by user.');
    }
  }

  // New method to start editing a row
  editRow(index: number) {
    this.editedRowIndex = index;
    this.selectedFoodItem = { ...this.foodItems[index] };
  }

  // Updated method to save changes in an edited row
  saveRow(index: number) {
    // Save changes to Firestore or perform any other necessary actions
    // For example, you can update the selected food item in Firestore here

   // this.editedRowIndex = -1;
   // this.selectedFoodItem = null;


    if (this.confirmationPrompt()) {
      // Update the food item in Firestore
      const catererUid = this.authService.getCatererUid();
  
      if (catererUid) {
        const selectedCategory = this.selectedCategory.toLowerCase();
  
        const docRef = this.firestore
          .collection('caterers')
          .doc(catererUid)
          .collection(`${selectedCategory}Items`)
          .doc(this.selectedFoodItem.foodItemId);
  
        // Explicitly set the updated food_name in the selectedFoodItem
        //this.selectedFoodItem.food_name = this.selectedFoodItem.food_name;
        const updatedFields = {
          food_image: this.selectedFoodItem.food_image,
          // Add other fields as needed
        };

        docRef.update(this.selectedFoodItem)
          .then(() => {
            this.editedRowIndex = -1;
            this.selectedFoodItem = null;
            alert('Food item updated successfully.');
          })
          .catch(error => {
            console.error('Error updating food item:', error);
            alert('Error updating food item. See console for details.');
          });
      } else {
        alert('Invalid caterer UID.');
      }
    }
  }

  // Updated method to cancel editing
  cancelEditRow() {
    const isConfirmed = window.confirm('Are you sure you want to cancel the food item update?');
    
    if (isConfirmed) {
      this.editedRowIndex = -1;
      this.selectedFoodItem = null;
    }
  }

  confirmationPrompt() {
    if (this.validateFields()) {
      const confirm = window.confirm('Are you sure you want to update food item changes?');
      return confirm;
    }
    return false;
  }

  validateFields() {
    if (
      this.selectedFoodItem.food_name &&
      this.selectedFoodItem.food_description &&
      this.selectedFoodItem.minimum_pax !== null &&
      this.selectedFoodItem.pax_price !== null &&
      this.selectedFoodItem.maximum_pax !== null &&
      (this.selectedFoodItem.category !== null && this.selectedFoodItem.category !== '') &&
      this.selectedFoodItem.minimum_pax >= 5 &&
      this.selectedFoodItem.minimum_pax <= this.selectedFoodItem.maximum_pax &&
      this.selectedFoodItem.pax_price >= 0
    ) {
      return true;
    } else {
      let errorMessage = 'Please fill in all fields correctly.';

      if (!this.selectedFoodItem.food_name) {
        errorMessage = 'Please enter a valid food name.';
      }

      if (!this.selectedFoodItem.food_description) {
        errorMessage = 'Please enter a valid food description.';
      }

      if (this.selectedFoodItem.minimum_pax < 5) {
        errorMessage = 'Minimum pax must be greater than 4.';
      }

      if (this.selectedFoodItem.pax_price < 0) {
        errorMessage = 'Pax price must be a non-negative number.';
      }

      if (
        this.selectedFoodItem.maximum_pax !== null &&
        this.selectedFoodItem.minimum_pax > this.selectedFoodItem.maximum_pax
      ) {
        errorMessage = 'Maximum pax must be greater than or equal to minimum pax.';
      }

      alert(errorMessage);
    }
    return false;
  }

  limitDigits(event: any, maxLength: number) {
    const input = event.target.value.replace(/\D/g, '');
    if (input.length > maxLength) {
      event.target.value = input.substr(0, maxLength);
      event.preventDefault();
    }
  }


  // Method to start editing a row
  startEditing(index: number): void {
    this.editedRowIndex = index;
    this.selectedFoodItem = { ...this.foodItems[index] };
  }

  // Method to cancel editing
  cancelEditing(): void {
    this.editedRowIndex = -1;
    this.selectedFoodItem = null;
  }

    // Method to handle image changes in the edit form
    uploadEditFoodImage(event: any) {
      if (this.selectedFoodItem) {
        const files = event.target.files;
        if (files.length > 0) {
          const selectedFile = files[0];
  
          const reader = new FileReader();
  
          reader.onload = (e: any) => {
            this.selectedFoodItem.food_image = e.target.result;
          };
  
          reader.readAsDataURL(selectedFile);
        }
      }
    }

//SPRINT 4 FILTERING
// Method to filter items based on the search text
filterItems(): any[] {
  if (!this.searchText && !this.searchMinPax && !this.searchMaxPax && !this.searchPaxPrice) {
    return this.foodItems;
  }

  const searchTextLower = this.searchText.toLowerCase();
  return this.foodItems.filter((item) => {
    return (
      item.food_name.toLowerCase().includes(searchTextLower) ||
      item.food_description.toLowerCase().includes(searchTextLower) ||
      (this.searchMinPax && item.minimum_pax.toString().includes(this.searchMinPax)) ||
      (this.searchMaxPax && item.maximum_pax.toString().includes(this.searchMaxPax)) ||
      (this.searchPaxPrice && item.pax_price.toString().includes(this.searchPaxPrice))
    );
  });
}

// Method to sort items based on food name
sortItems(direction: 'asc' | 'desc'): void {
  this.sortDirection = direction;

  this.foodItems.sort((a, b) => {
    const nameA = a.food_name.toLowerCase();
    const nameB = b.food_name.toLowerCase();

    if (nameA < nameB) {
      return direction === 'asc' ? -1 : 1;
    }

    if (nameA > nameB) {
      return direction === 'asc' ? 1 : -1;
    }

    return 0;
  });
}


}
