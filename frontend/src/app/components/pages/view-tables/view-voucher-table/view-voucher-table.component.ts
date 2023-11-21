import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-voucher-table',
  templateUrl: './view-voucher-table.component.html',
  styleUrls: ['./view-voucher-table.component.css']
})
export class ViewVoucherTableComponent implements OnInit {
  voucherItems: any[] = [];

  // Add a property to track the edited row
  editedRowIndex: number = -1;

  showUpdateVoucherForm: boolean = false;
  errorMessage: string = null;
  noItems: boolean = false;
  selectedvoucherItem: any = null;
  
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadVoucherItems();
  }

  loadVoucherItems() {
    const catererUid = this.authService.getCatererUid();

    if (catererUid) {
      this.firestore
        .collection('caterers')
        .doc(catererUid)
        .collection('voucherItems')
        .valueChanges()
        .subscribe(
          (items: any[]) => {
            console.log('Fetched voucher items:', items);
            this.voucherItems = items;
          },
          (error) => {
            console.error('Error fetching voucher items:', error);
          }
        );
    }
  }

  deleteVoucherItem(voucherItem: any): void {
    const catererUid = this.authService.getCatererUid();
    const voucherItemId = voucherItem.voucherID;

    const isConfirmed = window.confirm('Are you sure you want to delete this voucher item?');

    if (isConfirmed) {
      if (catererUid && voucherItemId) {
        const docRef = this.firestore.doc(`caterers/${catererUid}/voucherItems/${voucherItemId}`);

        docRef.delete().then(() => {
          this.voucherItems = this.voucherItems.filter(item => item.voucherID !== voucherItemId);
          alert('Voucher item deleted successfully.');
        }).catch(error => {
          alert('An error occurred while deleting the voucher item. Please try again later.');
          console.error('Error deleting voucher item:', error);
        });
      } else {
        alert('Invalid parameters for deleting voucher item.');
      }
    } else {
      console.log('Deletion cancelled by user.');
    }
  }

  // New method to start editing a row
  editRow(index: number) {
    this.editedRowIndex = index;
    this.selectedvoucherItem = { ...this.voucherItems[index] };
  }

// view-extra-service-table.component.ts

saveRow(index: number) {
  if (this.confirmationPrompt()) {
    const catererUid = this.authService.getCatererUid();

    if (catererUid) {
      const docRef = this.firestore
        .collection('caterers')
        .doc(catererUid)
        .collection('voucherItems')
        .doc(this.selectedvoucherItem.voucherID);

      // Explicitly set the updated fields in the selectedExtraServiceItem
      const updatedFields = {
        voucherType: this.selectedvoucherItem.voucherType,
        voucherName: this.selectedvoucherItem.voucherName,
        voucherDescription: this.selectedvoucherItem.voucherDescription,
        voucherImage: this.selectedvoucherItem.voucherImage,    
        itemQuantity: this.selectedvoucherItem.itemQuantity,
        grandTotal: this.selectedvoucherItem.grandTotal,
        discount: this.selectedvoucherItem.discount, 
        amountDeduction: this.selectedvoucherItem.amountDeduction,  
        // Add other fields as needed
      };

      docRef.update(updatedFields)
        .then(() => {
          this.editedRowIndex = -1;
          this.selectedvoucherItem = null;
          this.loadVoucherItems(); // Reload the items after updating
          alert('Voucher item updated successfully.');
        })
        .catch(error => {
          console.error('Error updating voucher item:', error);
          alert('Error updating voucher item. See console for details.');
        });
    } else {
      alert('Invalid caterer UID.');
    }
  }
}

  

  // Updated method to cancel editing
  cancelEditRow() {
    const isConfirmed = window.confirm('Are you sure you want to cancel the voucher item update?');
    
    if (isConfirmed) {
      this.editedRowIndex = -1;
      this.selectedvoucherItem = null;
    }
  }

  confirmationPrompt() {
    if (this.validateFields()) {
      const confirm = window.confirm('Are you sure you want to update voucher item changes?');
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
  uploadEditVoucherImage(event: any) {
    if (this.selectedvoucherItem) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.selectedvoucherItem.voucherImage = e.target.result;
        };

        reader.readAsDataURL(selectedFile);
      }
    }
  }
}
