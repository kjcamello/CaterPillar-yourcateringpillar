import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
}
