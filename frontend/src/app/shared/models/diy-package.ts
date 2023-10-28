/*import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { FoodItem } from 'src/app/shared/models/food-item';

@Injectable({
  providedIn: 'root',
})
export class DiyPackage {
  constructor(private afs: AngularFirestore) {}

  addSelectedFoodItemToPackage(selectedFoodItem: FoodItem) {
    // You can add the selected food item to Firestore
    const selectedFoodItemsCollection = this.afs.collection('selectedFoodItems');
    return selectedFoodItemsCollection.add(selectedFoodItem);
  }

  getSelectedFoodItemsFromPackage() {
    // Retrieve the selected food items from Firestore
    return this.afs.collection('selectedFoodItems').valueChanges();
  }

  // You can also add methods to remove food items from the package
}*/