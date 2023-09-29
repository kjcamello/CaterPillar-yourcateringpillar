import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
// import { AngularFireDatabase } from '@angular/fire/compat/database';
// import { AngularFireStore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CatererDataService {
  // private itemsCollection: AngularFirestoreCollection<any>;
  
  constructor(
    // private db: AngularFireStore
    private firestore: AngularFirestore
  ) { }

  // Function to add both catering and caterer info to the 'cateringData' collection
  addCateringData(cateringInfo: any, catererInfo: any): Promise<any> {
    return this.firestore.collection('cateringData').add({
      catering: cateringInfo,
      caterer: catererInfo
    });
  }
}
