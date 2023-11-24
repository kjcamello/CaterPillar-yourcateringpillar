// service-type.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { ServiceType } from '../models/service-type';


@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  private serviceTypesCollection: AngularFirestoreCollection<ServiceType>;
  serviceTypes: Observable<ServiceType[]>;

  constructor(private afs: AngularFirestore) {
    this.serviceTypesCollection = afs.collection<ServiceType>('serviceTypes');
    this.serviceTypes = this.serviceTypesCollection.valueChanges();
  }

  getServiceTypes(uid: string){
    return this.afs.collection('caterers').doc(uid).collection('serviceTypes').snapshotChanges();
  }

  addServiceType(serviceType: ServiceType, uid: string ) {
    //const id = this.afs.createId();
    //const serviceTypeWithId = { id, ...serviceType };
    //return this.serviceTypesCollection.doc(id).set(serviceTypeWithId);
    return this.afs.collection('caterers').doc(uid).collection('serviceTypes').add(serviceType);
  }
  

  updateServiceType(id: string, serviceType: any, uid: string){
    //return this.serviceTypesCollection.doc(id).update(serviceType);
    return this.afs.collection('caterers').doc(uid).collection('serviceTypes').doc(id).update(serviceType);
  }

  deleteServiceType(id: string, uid: string){
    //return this.serviceTypesCollection.doc(id).delete();
    return this.afs.collection('caterers').doc(uid).collection('serviceTypes').doc(id).delete();
  }
  
}
