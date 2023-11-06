import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FoodItemsService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {
  }

  // Modify the uploadImage method to accept the file and the selected category
  uploadImage(file: File, selectedCategory: string, foodItemId: string): Observable<string | null> {
    let filePath = `${selectedCategory.toLowerCase()}_images/${foodItemId}_${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return task.snapshotChanges().pipe(
      take(1),
      switchMap(() => {
        return fileRef.getDownloadURL();
      })
    );
  }

  // Update the updateFoodItem method based on your Firestore structure
  updateFoodItem(updatedFoodItem: any) {
    return this.firestore.collection('foodItems').doc(updatedFoodItem.id).update(updatedFoodItem);
  }

  // Update the deleteFoodItem method based on your Firestore structure
  deleteFoodItem(id: string) {
    return this.firestore.collection('foodItems').doc(id).delete();
  }

  saveFoodItem(foodItem: FoodItem, subcollectionName: string) {
    // Use the AuthService to get the current logged-in caterer's UID
    const catererUid = this.authService.getCatererUid();

    if (catererUid) {
      // Add additional fields if needed
      const foodItemData = this.toObject(foodItem);

      // Reference to the subcollection based on the category
      const subcollectionRef = this.firestore.collection(`caterers/${catererUid}/${subcollectionName}`);

      subcollectionRef.add(foodItemData)
        .then(() => {
          console.log('Food item saved successfully.');
          // You can also reset the form or perform other actions here
        })
        .catch(error => {
          console.error('Error saving food item:', error);
          // Handle the error, show a message, etc.
        });
    } else {
      console.error('No caterer UID available. Caterer is not logged in.');
    }
  }
  
    toObject(foodItem: FoodItem): any {
    return {
      food_name: foodItem.food_name,
      food_description: foodItem.food_description,
      minimum_pax: foodItem.minimum_pax,
      maximum_pax: foodItem.maximum_pax,
      pax_price: foodItem.pax_price,
      selected: foodItem.selected,
      food_image: foodItem.food_image,
      selectedPax: foodItem.selectedPax,
      catererUid: foodItem.catererUid,
      foodItemId: foodItem.foodItemId,
      isEditing: foodItem.isEditing,
      category: foodItem.category,
    };
  }
  
}
