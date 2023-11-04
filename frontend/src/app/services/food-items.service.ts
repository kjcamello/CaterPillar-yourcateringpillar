import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { FoodItem } from 'src/app/shared/models/food-item';

@Injectable({
  providedIn: 'root'
})
export class FoodItemsService {
  private foodItemsCollection: AngularFirestoreCollection<FoodItem>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {
    this.foodItemsCollection = afs.collection<FoodItem>('foodItems');
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

  
saveFoodItem(foodItem: any, subcollection: string, selectedCategory: string): Observable<any> {
  const catererUid = this.authService.getCatererUid();

  return new Observable<any>((observer) => {
    const foodItemId = this.afs.createId();
    const foodItemWithID = { ...foodItem, catererUid, foodItemId };

    this.afs
      .collection('caterers')
      .doc(catererUid)
      .collection(subcollection)
      .doc(foodItemId)
      .set(foodItemWithID)
      .then(() => {
        // Alert with foodItemId
        alert(`Food item saved successfully with ID: ${foodItemId}`);

        // Return the Firestore document ID
        observer.next({ id: foodItemId });
        observer.complete();
      })
      .catch((error) => {
        // Alert with the error message
        alert(`Error saving food item: ${error}`);

        observer.error(error);
      });
  });
}
  
  toObject(foodItem: FoodItem): any {
    return {
      food_name: foodItem.food_name,
      food_description: foodItem.food_description,
      minimum_pax: foodItem.minimum_pax,
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

/*
  saveFoodItem(foodItem: any, subcollection: string, selectedCategory: string): Observable<any> {
    const catererUid = this.authService.getCatererUid();
  
    return new Observable<any>((observer) => {
      const foodItemWithId = { ...foodItem, foodItemId: '' }; // Create a copy of the foodItem with an empty foodItemId
  
      const docRef = this.afs.collection('caterers')
        .doc(catererUid)
        .collection(subcollection)
        .add(foodItemWithId) // Use the copy with an empty foodItemId
        .then((doc) => {
          // Set the foodItemId to the Firestore document ID
          foodItemWithId.foodItemId = doc.id;
  
          observer.next(doc); // Return the Firestore document reference
          observer.complete();
          alert('Food item saved successfully with ID: ' + doc.id);
        })
        .catch(error => {
          observer.error(error);
          alert('Error saving food item: ' + error);
        });
    });
  }*/

  /*
  // Method to update a food item in Firestore
  updateFoodItem(foodItemId: string, updatedFoodItem: any): Promise<void> {
    return this.afs
      .collection('foodItems')
      .doc(foodItemId)
      .update(updatedFoodItem);
  }

  // Method to delete a food item from Firestore
  deleteFoodItem(foodItemId: string): Promise<void> {
    return this.afs
      .collection('foodItems')
      .doc(foodItemId)
      .delete();
  }
}*/


 /*
 getFoodItems(): Observable<FoodItem[]> {
  return this.foodItemsCollection.valueChanges();
}

getFoodItemsByCategory(category: string): Observable<FoodItem[]> {
  return this.getFoodItems().pipe(
    map((foodItems) => foodItems.filter((item) => item.category === category))
  );
}*/