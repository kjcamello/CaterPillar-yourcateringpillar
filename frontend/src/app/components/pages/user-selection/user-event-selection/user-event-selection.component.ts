// user-event-selection.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { EventSelectionService } from 'src/app/services/event-selection.service';

@Component({
  selector: 'app-user-event-selection',
  templateUrl: './user-event-selection.component.html',
  styleUrls: ['./user-event-selection.component.css']
})
export class UserEventSelectionComponent implements OnInit {
  catererUid: string;
  eventItems: Observable<any[]>;
  selectedEvent: any; // Track the selected event separately
  dateAndTimeForm: FormGroup; // Add this line for the new form

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder, // Add this line for the form builder
    private eventSelectionService: EventSelectionService
    ) {
          // Initialize the form in the constructor
          this.dateAndTimeForm = this.formBuilder.group({
            // Define your form controls here
            selectedDate: ['', Validators.required],
            selectedTime: ['', Validators.required]
            // Add other form controls as needed
          });
        }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.catererUid = params['catererUid'];
      this.loadEventItems();
    });
  }

  loadEventItems() {
    const collectionPath = `caterers/${this.catererUid}/eventItems`;
    this.eventItems = this.firestore.collection(collectionPath).valueChanges().pipe(
      map((items: any[]) => items.map(item => ({ ...item, selected: false })))
    );
  }

  eventtoggleDescription(eventItem: any): void {
    eventItem.showFullDescription = !eventItem.showFullDescription;
  }

  toggleEventSelection(eventItem: any): void {
    // Toggle the selected property of the clicked eventItem
    eventItem.selected = !eventItem.selected;

    // Set the selectedEvent if the item is selected
    this.selectedEvent = eventItem.selected ? eventItem : null;
  }
  
  selectEvent(eventItem: any): void {
    this.eventSelectionService.setSelectedEvent(eventItem);
  }

}


