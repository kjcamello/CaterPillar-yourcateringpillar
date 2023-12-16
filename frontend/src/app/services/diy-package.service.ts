import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiyPackageService {
  constructor(private firestore: AngularFirestore) {}

  getPackageDetails(packageUid: string): Observable<any> {
    return this.firestore.doc(`addToCartDIYPackage/${packageUid}`).valueChanges();
  }

  getFoodItemsDetails(foodItemIds: string[]): Observable<any[]> {
    const foodItemObservables = foodItemIds.map(foodItemId =>
      this.firestore.doc(`maincourseItems/${foodItemId}`).valueChanges()
    );
    return combineLatest(foodItemObservables);
  }

  getExtraServicesDetails(extraServiceIds: string[]): Observable<any[]> {
    const extraServiceObservables = extraServiceIds.map(extraServiceId =>
      this.firestore.doc(`extraServices/${extraServiceId}`).valueChanges()
    );
  
    return forkJoin(extraServiceObservables);
  }

  addToCart(packageData: any): Promise<any> {
    // Add your Firestore collection path
    const collectionPath = 'addToCartDIYPackage';

    // Use Firestore to add the package to the collection
    return this.firestore.collection(collectionPath).add(packageData);
  }
}
