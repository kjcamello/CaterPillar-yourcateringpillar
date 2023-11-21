import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-event-table',
  templateUrl: './view-event-table.component.html',
  styleUrls: ['./view-event-table.component.css']
})
export class ViewEventTableComponent implements OnInit {
  eventItems: any[] = [];

  // Add a property to track the edited row
  editedRowIndex: number = -1;

  showUpdateEventForm: boolean = false;
  errorMessage: string = null;
  noItems: boolean = false;
  selectedeventItem: any = null;
  
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadEventItems();
  }

  loadEventItems() {
    const catererUid = this.authService.getCatererUid();

    if (catererUid) {
      this.firestore
        .collection('caterers')
        .doc(catererUid)
        .collection('eventItems')
        .valueChanges()
        .subscribe(
          (items: any[]) => {
            console.log('Fetched event items:', items);
            this.eventItems = items;
          },
          (error) => {
            console.error('Error fetching event items:', error);
          }
        );
    }
  }

  deleteEventItem(eventItem: any): void {
    const catererUid = this.authService.getCatererUid();
    const eventItemId = eventItem.eventID;

    const isConfirmed = window.confirm('Are you sure you want to delete this event item?');

    if (isConfirmed) {
      if (catererUid && eventItemId) {
        const docRef = this.firestore.doc(`caterers/${catererUid}/eventItems/${eventItemId}`);

        docRef.delete().then(() => {
          this.eventItems = this.eventItems.filter(item => item.eventID !== eventItemId);
          alert('Event item deleted successfully.');
        }).catch(error => {
          alert('An error occurred while deleting the event item. Please try again later.');
          console.error('Error deleting event item:', error);
        });
      } else {
        alert('Invalid parameters for deleting event item.');
      }
    } else {
      console.log('Deletion cancelled by user.');
    }
  }

  // New method to start editing a row
  editRow(index: number) {
    this.editedRowIndex = index;
    this.selectedeventItem = { ...this.eventItems[index] };
  }

// view-event-table.component.ts

saveRow(index: number) {
  if (this.confirmationPrompt()) {
    const catererUid = this.authService.getCatererUid();

    if (catererUid) {
      const docRef = this.firestore
        .collection('caterers')
        .doc(catererUid)
        .collection('eventItems')
        .doc(this.selectedeventItem.eventID);

      // Explicitly set the updated fields in the selectedEventItem
      const updatedFields = {
        eventName: this.selectedeventItem.eventName,
        eventDescription: this.selectedeventItem.eventDescription,
        // Add other fields as needed
      };

      docRef.update(updatedFields)
        .then(() => {
          this.editedRowIndex = -1;
          this.selectedeventItem = null;
          this.loadEventItems(); // Reload the items after updating
          alert('Event item updated successfully.');
        })
        .catch(error => {
          console.error('Error updating event item:', error);
          alert('Error updating event item. See console for details.');
        });
    } else {
      alert('Invalid caterer UID.');
    }
  }
}

  

  // Updated method to cancel editing
  cancelEditRow() {
    const isConfirmed = window.confirm('Are you sure you want to cancel the event item update?');
    
    if (isConfirmed) {
      this.editedRowIndex = -1;
      this.selectedeventItem = null;
    }
  }

  confirmationPrompt() {
    if (this.validateFields()) {
      const confirm = window.confirm('Are you sure you want to update event item changes?');
      return confirm;
    }
    return false;
  }

  validateFields() {
    // Add your validation logic for event items
    return true;
  }

  limitDigits(event: any, maxLength: number) {
    const input = event.target.value.replace(/\D/g, '');
    if (input.length > maxLength) {
      event.target.value = input.substr(0, maxLength);
      event.preventDefault();
    }
  }
}