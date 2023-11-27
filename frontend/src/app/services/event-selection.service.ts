// event-selection.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventSelectionService {
  private selectedEventSource = new BehaviorSubject<any>(null);
  selectedEvent$ = this.selectedEventSource.asObservable();

  private selectedExtraServicesSubject = new BehaviorSubject<any[]>([]);
  selectedExtraServices$ = this.selectedExtraServicesSubject.asObservable();

  setSelectedExtraServices(selectedExtraServices: any[]): void {
    this.selectedExtraServicesSubject.next(selectedExtraServices);
  }

  getSelectedExtraServices(): any[] {
    return this.selectedExtraServicesSubject.value;
  }

  // Add new BehaviorSubject for selected voucher items
  private selectedVoucherItemsSubject = new BehaviorSubject<any[]>([]);
  selectedVoucherItems$ = this.selectedVoucherItemsSubject.asObservable();

  // Add methods to set and get selected voucher items
  setSelectedVoucherItems(selectedVoucherItems: any[]): void {
    this.selectedVoucherItemsSubject.next(selectedVoucherItems);
  }

  getSelectedVoucherItems(): any[] {
    return this.selectedVoucherItemsSubject.value;
  }
  
  setSelectedEvent(event: any) {
    this.selectedEventSource.next(event);
  }

  private selectedVoucherSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedVoucher$: Observable<any> = this.selectedVoucherSubject.asObservable();

  setSelectedVoucher(selectedVoucher: any): void {
    this.selectedVoucherSubject.next(selectedVoucher);
  }

  private selectedFoodItemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedFoodItems$: Observable<any[]> = this.selectedFoodItemsSubject.asObservable();

  setSelectedFoodItems(selectedFoodItems: any[]): void {
    this.selectedFoodItemsSubject.next(selectedFoodItems);
  }

}
