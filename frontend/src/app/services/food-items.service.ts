import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FoodItem } from 'src/app/shared/models/food-item';

import { UserAuthService } from 'src/app/services/userauth.service';
import { AuthService } from './auth.service';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { take, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodItemsService {
  private selectedItemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedItems$: Observable<any[]> = this.selectedItemsSubject.asObservable();


  private selectedExtraServiceItemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedExtraServiceItems$: Observable<any[]> = this.selectedExtraServiceItemsSubject.asObservable();

  setSelectedItems(items: any[]): void {
    this.selectedItemsSubject.next(items);
  }

  getExtraServiceItems(): Observable<any[]> {
    // Replace 'your_collection_name' with the actual name of your Firestore collection
    return this.firestore.collection('your_collection_name').valueChanges().pipe(
      take(1),
      tap((extraServiceItems: any[]) => {
        // Notify subscribers about the change in selectedExtraServiceItems
        this.selectedExtraServiceItemsSubject.next(extraServiceItems);
      })
    );
  }

  setSelectedExtraServiceItems(items: any[]): void {
    this.selectedExtraServiceItemsSubject.next(items);
  }

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private userauthService: UserAuthService
  ) {
  }

  // Modify the uploadImage method to accept the file and the selected category
  uploadImage(file: File | null, selectedCategory: string, foodItemId: string): Observable<string | null> {
    if (!file) {
      // Return the URL of your default image when no file is provided
      return of('https://firebasestorage.googleapis.com/v0/b/caterpillar-hestia.appspot.com/o/_images%2Fdefault_no_image.png?alt=media');
    }
  
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
  

  // Update the deleteFoodItem method based on your Firestore structure
  deleteFoodItem(catererUid: string, selectedCategory: string, foodItemId: string): void {
    const docRef = this.firestore.doc(`caterers/${catererUid}/${selectedCategory}Items/${foodItemId}`);
    
    docRef.delete().then(() => {
      console.log('Food item deleted successfully.');
    }).catch(error => {
      console.error('Error deleting food item:', error);
    });
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
  
  saveEventItem(eventItem: any): void {
    const catererUid = this.authService.getCatererUid();
  
    if (catererUid) {
      const eventData = this.toEventObject(eventItem);
      const eventSubcollectionRef = this.firestore.collection(`caterers/${catererUid}/eventItems`);
  
      eventSubcollectionRef.add(eventData)
        .then((docRef) => {
          // Update the firestoreID field with the generated document ID
          docRef.update({ eventID: docRef.id });
          alert('Event item saved successfully.');
          // You can also reset the form or perform other actions here
        })
        .catch(error => {
          alert('Error saving event item: ' + error);
          // Handle the error, show a message, etc.
        });
    } else {
      alert('No caterer UID available. Caterer is not logged in.');
    }
  }

    // Convert event data to Firestore object
    private toEventObject(eventItem: any): any {
      // Implement conversion logic based on your event item structure
      return {
        // Map event fields to Firestore fields
        catererUid: eventItem.catererUid,  
        eventID:  null, // Keep this line if esID is provided, otherwise remove it
        eventName: eventItem.eventName,
        eventDescription: eventItem.eventDescription,   
        // Add other fields as needed
      };
    }

    saveExtraServiceItem(extraserviceItem: any): void {
      const catererUid = this.authService.getCatererUid();
    
      if (catererUid) {
        const extraserviceData = this.toExtraServiceObject(extraserviceItem);
        const extraserviceSubcollectionRef = this.firestore.collection(`caterers/${catererUid}/extraserviceItems`);
    
        extraserviceSubcollectionRef.add(extraserviceData)
          .then((docRef) => {
            // Update the firestoreID field with the generated document ID
            docRef.update({ esID: docRef.id });
            alert('Extra service saved successfully.');
            // You can also reset the form or perform other actions here
          })
          .catch(error => {
            alert('Error saving extra service item: ' + error);
            // Handle the error, show a message, etc.
          });
      } else {
        alert('No caterer UID available. Caterer is not logged in.');
      }
    }

      // Convert event data to Firestore object
// Convert event data to Firestore object
private toExtraServiceObject(extraserviceItem: any): any {
  // Implement conversion logic based on your extra service item structure
  return {
    catererUid: extraserviceItem.catererUid,
    esID: null, // Keep this line if esID is provided, otherwise remove it
    esName: extraserviceItem.esName,
    esDescription: extraserviceItem.esDescription,
    esImage: extraserviceItem.esImage,
    esMinHours: extraserviceItem.esMinHours,
    esMaxHours: extraserviceItem.esMaxHours,
    esPrice: extraserviceItem.esPrice,
  };
}


  // Method to save voucher item
  saveVoucherItem(voucherItem: any): void {
    const catererUid = this.authService.getCatererUid();
  
    if (catererUid) {
      const voucherData = this.toVoucherObject(voucherItem);
      const voucherSubcollectionRef = this.firestore.collection(`caterers/${catererUid}/voucherItems`);
  
      voucherSubcollectionRef.add(voucherData)
        .then((docRef) => {
          // Update the firestoreID field with the generated document ID
          docRef.update({ voucherID: docRef.id });
          alert('Voucher item saved successfully.');
          // You can also reset the form or perform other actions here
        })
        .catch(error => {
          alert('Error saving voucher item: ' + error);
          // Handle the error, show a message, etc.
        });
    } else {
      alert('No caterer UID available. Caterer is not logged in.');
    }
  }

  // Convert voucher data to Firestore object
  private toVoucherObject(voucherItem: any): any {
    // Implement conversion logic based on your voucher item structure
    return {
      // Map voucher fields to Firestore fields
      catererUid: voucherItem.catererUid,  
      voucherID: null, 
      voucherType: voucherItem.voucherType,
      voucherName: voucherItem.voucherName,
      voucherDescription: voucherItem.voucherDescription,
      voucherImage: voucherItem.voucherImage,    
      itemQuantity: voucherItem.itemQuantity,
      grandTotal: voucherItem.grandTotal,
      discount: voucherItem.discount, 
      amountDeduction: voucherItem.amountDeduction,     
      // Add other fields as needed
    };
  }

  saveToCart(selectedPackage: any, userUid: string, packageName: string): void {
    // Use the Firestore-generated ID as packageUid
    const packageUid = this.firestore.createId();
  
    const cartData = {
      selectedPackage,
      packageName,
      packageUid,
      // Add any other data you want to save to the cart
    };
  
    const cartSubcollectionRef = this.firestore.collection(`customers/${userUid}/addToCartDIYPackage`);
  
    // Add the data to the cart subcollection
    cartSubcollectionRef.add(cartData)
      .then(docRef => {
        alert('This D-I-Y Package has been added to cart successfully.');
        console.log('This D-I-Y Package has been added to cart successfully.');
        console.log('Package UID:', docRef.id); // Use the Firestore-generated ID
        // You can also show a confirmation message or update UI as needed
      })
      .catch(error => {
        alert('Error adding package to cart:');
        console.error('Error adding package to cart:', error);
        // Handle the error, show a message, etc.
      });
  }

}
