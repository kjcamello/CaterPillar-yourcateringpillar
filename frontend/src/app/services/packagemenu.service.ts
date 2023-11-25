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

  getEventItems(uid: string): Observable<string[]> {
    return this.firestore.collection('caterers').doc(uid).collection('eventItems').valueChanges().pipe(
      map((items: any[]) => items.map(item => item.eventName)),
      catchError(error => {
        console.error('Error getting appetizer items:', error);
        return [];
      })
    );
  }

  getAppetizerItems(uid: string): Observable<any[]> {
    return this.firestore.collection('caterers').doc(uid).collection('appetizerItems').valueChanges();
  }
  

  getSoupItems(uid: string): Observable<any[]> {
    return this.firestore.collection('caterers').doc(uid).collection('soupItems').valueChanges();
  }

  getSaladItems(uid: string): Observable<any[]> {
    return this.firestore.collection('caterers').doc(uid).collection('saladItems').valueChanges();
  }

  getMainCourseItems(uid: string): Observable<any[]> {
    return this.firestore.collection('caterers').doc(uid).collection('maincourseItems').valueChanges();
  }

  getDessertItems(uid: string): Observable<any[]> {
    return this.firestore.collection('caterers').doc(uid).collection('dessertItems').valueChanges();
  }

  getDrinkItems(uid: string): Observable<any[]> {
    return this.firestore.collection('caterers').doc(uid).collection('drinkItems').valueChanges();
  }
}
