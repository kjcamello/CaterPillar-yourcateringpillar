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

  getServiceTypes(): Observable<ServiceType[]> {
    return this.serviceTypesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ServiceType;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
      
    );
  }

  addServiceType(serviceType: ServiceType): Promise<void> {
    const id = this.afs.createId();
    const serviceTypeWithId = { id, ...serviceType };
    return this.serviceTypesCollection.doc(id).set(serviceTypeWithId);
  }
  

  updateServiceType(id: string, serviceType: ServiceType): Promise<void> {
    return this.serviceTypesCollection.doc(id).update(serviceType);
  }

  deleteServiceType(id: string): Promise<void> {
    return this.serviceTypesCollection.doc(id).delete();
  }

  

  
}
