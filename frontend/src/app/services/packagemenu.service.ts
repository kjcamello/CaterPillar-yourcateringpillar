import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackagemenuService {

  constructor(private firestore: AngularFirestore) { }

  // Updated addPackage method
  addPackage(packageData: any, uid: string) {
    // Use the 'add' method to auto-generate a document ID for the package
    return this.firestore.collection('caterers').doc(uid).collection('packages').add(packageData);
  }

  // Updated getPackages method
  getPackages(uid: string) {
    return this.firestore.collection('caterers').doc(uid).collection('packages').snapshotChanges();
  }

  // Updated getPackageById method
  getPackageById(uid: string, id: string) {
    return this.firestore.collection('caterers').doc(uid).collection('packages').doc(id).valueChanges();
  }

  // Updated updatePackage method
  updatePackage(uid: string, id: string, data: any) {
    return this.firestore.collection('caterers').doc(uid).collection('packages').doc(id).update(data);
  }

  // Updated deletePackage method
  deletePackage(uid: string, id: string) {
    return this.firestore.collection('caterers').doc(uid).collection('packages').doc(id).delete();
  }

  getAppetizerItems(uid: string): Observable<string[]> {
    return this.firestore.collection('caterers').doc(uid).collection('appetizerItems').valueChanges().pipe(
      map((items: any[]) => items.map(item => item.food_name)),
      catchError(error => {
        console.error('Error getting appetizer items:', error);
        return [];
      })
    );
  }
  

  getSoupItems(uid: string) {
    return this.firestore.collection('caterers').doc(uid).collection('soupItems').valueChanges().pipe(
      map((items: any[]) => items.map(item => item.food_name)),
      catchError(error => {
        console.error('Error getting appetizer items:', error);
        return [];
      })
    );
  }

  getSaladItems(uid: string) {
    return this.firestore.collection('caterers').doc(uid).collection('saladItems').valueChanges().pipe(
      map((items: any[]) => items.map(item => item.food_name)),
      catchError(error => {
        console.error('Error getting appetizer items:', error);
        return [];
      })
    );
  }

  getMainCourseItems(uid: string) {
    return this.firestore.collection('caterers').doc(uid).collection('maincourseItems').valueChanges().pipe(
      map((items: any[]) => items.map(item => item.food_name)),
      catchError(error => {
        console.error('Error getting appetizer items:', error);
        return [];
      })
    );
  }

  getDessertItems(uid: string) {
    return this.firestore.collection('caterers').doc(uid).collection('dessertItems').valueChanges().pipe(
      map((items: any[]) => items.map(item => item.food_name)),
      catchError(error => {
        console.error('Error getting appetizer items:', error);
        return [];
      })
    );
  }
}
