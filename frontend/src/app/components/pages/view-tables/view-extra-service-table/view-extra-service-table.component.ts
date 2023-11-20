import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-extra-service-table',
  templateUrl: './view-extra-service-table.component.html',
  styleUrls: ['./view-extra-service-table.component.css']
})
export class ViewExtraServiceTableComponent implements OnInit {
  extraserviceItems: any[] = [];

  // Add a property to track the edited row
  editedRowIndex: number = -1;

  showUpdateExtraServiceForm: boolean = false;
  errorMessage: string = null;
  noItems: boolean = false;
  selectedextraserviceItem: any = null;
  
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadExtraserviceItems();
  }

  loadExtraserviceItems() {
    const catererUid = this.authService.getCatererUid();

    if (catererUid) {
      this.firestore
        .collection('caterers')
        .doc(catererUid)
        .collection('extraserviceItems')
        .valueChanges()
        .subscribe(
          (items: any[]) => {
            console.log('Fetched extra service items:', items);
            this.extraserviceItems = items;
          },
          (error) => {
            console.error('Error fetching extra service items:', error);
          }
        );
    }
  }

  deleteExtraServiceItem(extraserviceItem: any): void {
    const catererUid = this.authService.getCatererUid();
    const extraserviceItemId = extraserviceItem.esID;

    const isConfirmed = window.confirm('Are you sure you want to delete this extra service item?');

    if (isConfirmed) {
      if (catererUid && extraserviceItemId) {
        const docRef = this.firestore.doc(`caterers/${catererUid}/extraserviceItems/${extraserviceItemId}`);

        docRef.delete().then(() => {
          this.extraserviceItems = this.extraserviceItems.filter(item => item.esID !== extraserviceItemId);
          alert('Extra service item deleted successfully.');
        }).catch(error => {
          alert('An error occurred while deleting the extra service item. Please try again later.');
          console.error('Error deleting extra service item:', error);
        });
      } else {
        alert('Invalid parameters for deleting extra service item.');
      }
    } else {
      console.log('Deletion cancelled by user.');
    }
  }

  // New method to start editing a row
  editRow(index: number) {
    this.editedRowIndex = index;
    this.selectedextraserviceItem = { ...this.extraserviceItems[index] };
  }

// view-extra-service-table.component.ts

saveRow(index: number) {
  if (this.confirmationPrompt()) {
    const catererUid = this.authService.getCatererUid();

    if (catererUid) {
      const docRef = this.firestore
        .collection('caterers')
        .doc(catererUid)
        .collection('extraserviceItems')
        .doc(this.selectedextraserviceItem.esID);

      // Explicitly set the updated fields in the selectedExtraServiceItem
      const updatedFields = {
        esImage: this.selectedextraserviceItem.esImage,
        esName: this.selectedextraserviceItem.esName,
        esDescription: this.selectedextraserviceItem.esDescription,
        esMinHours: this.selectedextraserviceItem.esMinHours,
        esMaxHours: this.selectedextraserviceItem.esMaxHours,
        esPrice: this.selectedextraserviceItem.esPrice,
        // Add other fields as needed
      };

      docRef.update(updatedFields)
        .then(() => {
          this.editedRowIndex = -1;
          this.selectedextraserviceItem = null;
          this.loadExtraserviceItems(); // Reload the items after updating
          alert('Extra service item updated successfully.');
        })
        .catch(error => {
          console.error('Error updating extra service item:', error);
          alert('Error updating extra service item. See console for details.');
        });
    } else {
      alert('Invalid caterer UID.');
    }
  }
}

  

  // Updated method to cancel editing
  cancelEditRow() {
    const isConfirmed = window.confirm('Are you sure you want to cancel the extra service item update?');
    
    if (isConfirmed) {
      this.editedRowIndex = -1;
      this.selectedextraserviceItem = null;
    }
  }

  confirmationPrompt() {
    if (this.validateFields()) {
      const confirm = window.confirm('Are you sure you want to update extra service item changes?');
      return confirm;
    }
    return false;
  }

  validateFields() {
    // Add your validation logic for extra service items
    return true;
  }

  limitDigits(event: any, maxLength: number) {
    const input = event.target.value.replace(/\D/g, '');
    if (input.length > maxLength) {
      event.target.value = input.substr(0, maxLength);
      event.preventDefault();
    }
  }

  // Method to handle image changes in the edit form
  uploadEditExtraServiceImage(event: any) {
    if (this.selectedextraserviceItem) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.selectedextraserviceItem.esImage = e.target.result;
        };

        reader.readAsDataURL(selectedFile);
      }
    }
  }
}
