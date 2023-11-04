import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { FoodItemsService } from 'src/app/services/food-items.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent {
  private foodItemsCollection: AngularFirestoreCollection<FoodItem>;

  @Input() foodItem: FoodItem;
  @Input() isEditMode: boolean;
  @Output() saveFood: EventEmitter<FoodItem> = new EventEmitter<FoodItem>();
  foodItems: FoodItem[] = [];

  errorMessage: string = null;

  editMode: boolean = false;
  editingFoodItem: FoodItem = new FoodItem();

  foodImage: string;
  food_name: string;
  food_description: string;
  minimum_pax: number;
  pax_price: number;
  selectedCategory: string;

  subcollection: string;

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private foodItemsService: FoodItemsService
  ){
    this.foodItemsCollection = afs.collection<FoodItem>('foodItems');

    this.foodItem = {
      food_name: '',
      food_description: '',
      minimum_pax: 0,
      pax_price: 0,
      category: 'maincourse',
      food_image: '',
      selected: false, // Example property
      selectedPax: 0, // Example property
      catererUid: '', // Example property
      foodItemId: '', // Example property
      isEditing: false, // Example property
      // ... other properties
    };
  }

  getCategoryLabel(): string {
    switch (this.foodItem.category) {
      case 'maincourse':
        return 'Main Course';
      case 'appetizer':
        return 'Appetizer';
      case 'soup':
        return 'Soup';
      case 'salad':
        return 'Salad';
      case 'dessert':
        return 'Dessert';
      case 'drink':
          return 'Drink';        
      default:
        return 'Food';
    }
  }

  uploadFoodImage(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const selectedFile = files[0];
  
      if (
        selectedFile.type === 'image/jpeg' ||
        selectedFile.type === 'image/jpg' ||
        selectedFile.type === 'image/png'
      ) {
        this.errorMessage = ''; // Clear any previous error message
        this.foodItem.food_image = selectedFile;
  
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.foodItem.food_image = e.target.result;
        };
  
        reader.readAsDataURL(selectedFile);
      } else {
        this.errorMessage = 'File not uploaded. It must be a .jpg, .jpeg, or .png file.';
        alert(this.errorMessage);
  
        event.target.value = '';
        this.foodItem.food_image = null;
      }
    }
  }
  

// Inside FoodItemComponent
saveFoodItem() {
  if (this.validateFields()) {
    const subcollection = this.getSubcollectionForCategory(this.foodItem.category); // Call the method here
    const catererUid = this.authService.getCatererUid();

    if (!catererUid) {
      console.error('Caterer not authenticated');
      alert('Caterer not authenticated');
      return;
    }

    const foodItemData = this.foodItemsService.toObject(this.foodItem);

    this.foodItemsService.saveFoodItem(foodItemData, subcollection, this.foodItem.category).subscribe(
      (documentRef) => {
        const file = this.convertDataUrlToFile(this.foodItem.food_image, 'image.jpg', 'image/jpeg');

        this.foodItemsService.uploadImage(file, this.foodItem.category, documentRef.id).subscribe(
          (downloadUrl) => {
            this.foodItem.food_image = downloadUrl;
            this.foodItem.foodItemId = documentRef.id;
            console.log('Food item saved successfully.');
          },
          (error) => {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error);
          }
        );
      },
      (error) => {
        console.error('Error saving food item:', error);
        alert('Error saving food item: ' + error);
      }
    );
  }
}


  private validateFields(): boolean {
    console.log('food_name:', this.foodItem.food_name);
    console.log('food_description:', this.foodItem.food_description);
    console.log('minimum_pax:', this.foodItem.minimum_pax);
    console.log('pax_price:', this.foodItem.pax_price);
    console.log('category:', this.foodItem.category);
  
    if (
      this.foodItem.food_name &&
      this.foodItem.food_description &&
      this.foodItem.minimum_pax !== null &&
      this.foodItem.minimum_pax > 0 &&
      this.foodItem.pax_price !== null &&
      this.foodItem.pax_price > 0 &&
      (this.foodItem.category !== null && this.foodItem.category !== '')
    ) {
      return true;
    } else {
      alert('Please fill in all fields correctly.');
    }
    return false;
  }
  

  

  convertDataUrlToFile(dataURL: string, fileName: string, fileType: string): File {
    const byteString = atob(dataURL.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Int8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], { type: fileType });
    return new File([blob], fileName, { type: fileType });
  }

  getSubcollectionForCategory(category: string): string | null {
    switch (category) {
      case 'maincourse':
        return 'maincourseItems';
      case 'appetizer':
        return 'appetizerItems';
      case 'soup':
        return 'soupItems';
      case 'salad':
        return 'saladItems';
      case 'dessert':
        return 'dessertItems';
      case 'drink':
        return 'drinkItems';
      default:
        return null;
    }
  }

  resetFormFields() {
    this.foodItem = new FoodItem();
    this.foodItem.foodItemId = ''; // Reset the foodItemId to an empty string
  }
  
/*
  onFileSelected(event: any, selectedCategory: string) {
    const file: File = event.target.files[0];

    this.foodItemsService.uploadImage(file, this.foodItem.category, this.foodItem.foodItemId).subscribe(
      (downloadUrl: string) => {
        this.foodImage = downloadUrl;
      },
      (error: any) => {
        console.error('Error uploading image:', error);
      }
    );
  }*/
  
}
