//event-selection.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  setSelectedEvent(event: any) {
    this.selectedEventSource.next(event);
  }
}

