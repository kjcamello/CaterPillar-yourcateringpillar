// event-selection.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventSelectionService {
  private selectedEventSource = new BehaviorSubject<any>(null);
  selectedEvent$ = this.selectedEventSource.asObservable();

  setSelectedEvent(event: any) {
    this.selectedEventSource.next(event);
  }
}
