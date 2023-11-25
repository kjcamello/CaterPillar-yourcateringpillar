import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { UserAuthService } from 'src/app/services/userauth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChangeDetectorRef } from '@angular/core';



export interface Caterer {
  id: string;
  catererDisplayName: string;
  catererEmail: string;
  status: string;
  remarks: string;
  selectedAction: string; 
  selectedRemark: string;// Add this property
}

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();
//unfixed on this part
    return items.filter(item => {
      return (
        item.caterer.catererBasicInfo.catererDisplayName.toLowerCase().includes(searchText) ||
        item.caterer.catererBasicInfo.catererEmail.toLowerCase().includes(searchText)
      )
    });
  }
}

//Create the orderBy pipe
@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(items: any[], config: any): any[] {
    if (!config || !config.column) {
      return items;
    }

    const column = config.column;
    const order = config.order || 'asc';

    return items.sort((A,B) => {
      const aValue = A[column];
      const bValue = B[column];

      if (aValue === bValue) {
        return 0;
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
}

@Component({
  selector: 'app-superadmin-customer',
  templateUrl: './superadmin-customer.component.html',
  styleUrls: ['./superadmin-customer.component.css'],
  providers: [ FilterPipe, OrderByPipe] 
})
export class SuperadminCustomerComponent implements OnInit {

  loggedInCustomers$: any[] = [];
  caterers: Caterer[] = [];
  displayedColumns: string[] = ['status', 'catererDisplayName', 'catererEmail'];
  firestore: any;
  afAuth: any;
  searchTerm: string;
  sortOrder: string = 'asc'; // 'asc' for ascending, 'desc' for descending
  sortByColumn: string = 'catererDisplayName';

  constructor(public userauthService: UserAuthService, private afs: AngularFirestore, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.userauthService.getCaterers().subscribe((loggedInCustomers) => {
      this.caterers = loggedInCustomers.map(caterer => {
        caterer.selectedAction = '';
        caterer.selectedRemark = ''; // Initialize selectedAction
        return caterer;
      });
      console.log(this.caterers);
    });
  }

  
  sortBy(column: string): void {
    if (this.sortByColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOrder = 'asc';
    }
  
    this.sortByColumn = column;
  
    if (this.sortByColumn === 'catererEmail') {
      this.sortCaterers();
    }
  }

  private sortCaterers(): void {
    this.caterers.sort((a, b) => {
      const aValue = a[this.sortByColumn].toLowerCase();
      const bValue = b[this.sortByColumn].toLowerCase();
  
      if (this.sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }

  // Function to get available actions based on status
  getAvailableActions(status: string): string[] {
    switch (status) {
      case 'Active':
        return ['Warn', 'Disable'];
      case 'Warned':
        return ['Unwarn'];
      case 'Disabled':
        return ['Enable'];
      default:
        return [];
    }
  }

  private updateFirestoreDocument(caterer: Caterer, selectedAction: string): void {
    let newStatus: string;
  
    switch (selectedAction) {
      case 'Warn':
        newStatus = 'Warned';
        break;
      case 'Disable':
        newStatus = 'Disabled';
        break;
      case 'Enable':
        newStatus = 'Active';
        break;
      case 'Unwarn':
        newStatus = 'Active';
        break;
      default:
        console.log(`Unhandled action: ${selectedAction}`);
        return; // Do nothing if the action is not handled
    }
  
    // Check if caterer.id is defined
    if (!caterer.id) {
      console.error('Caterer ID is undefined. Unable to update Firestore document.');
      return;
    }
  
    // Update the Firestore document directly
    console.log('Caterer ID:', caterer.id);
    const catererDocRef = this.afs.collection('caterers').doc(caterer.id);
    catererDocRef.update({ status: newStatus }).then(
      () => {
        console.log('Firestore document updated successfully.');
        // Update the local caterer object
        caterer.status = newStatus;
        if(newStatus=='Active'){
          catererDocRef.update({remarks: 'None'});
        }
        // Trigger change detection to update the UI
        this.detectChanges();
      },
      error => {
        console.error('Error updating Firestore document:', error);
      }
    );
  }
  handleRemarksDropdownChange(caterer: Caterer): void {
    const newRemark = caterer.selectedRemark;
  
    // Check if caterer.id is defined
    if (!caterer.id) {
      console.error('Caterer ID is undefined. Unable to update Firestore document.');
      return;
    }
  
    console.log('Caterer ID:', caterer.id);
    const catererDocRef = this.afs.collection('caterers').doc(caterer.id);
  
    catererDocRef.update({ remarks: newRemark }).then(
      () => {
        console.log('First Firestore document update (remarks) successfully.');
  
        // If the new remark is 'Active', update the 'status' field to 'Active' and 'remarks' to 'None'
        if (newRemark === 'Active') {
          return catererDocRef.update({ status: 'Active', remarks: 'None' });
        }
  
        return Promise.resolve(); // Resolve the promise to continue the chain
      }
    ).then(
      () => {
        console.log('Second Firestore document update (status) successfully.');
        // Update the local caterer object
        caterer.remarks = newRemark;
  
        // Trigger change detection to update the UI
        this.detectChanges();
      }
    ).catch(
      error => {
        console.error('Error updating Firestore document:', error);
      }
    );
  }
  
  

  private detectChanges(): void {
    // Manually trigger change detection
    this.changeDetectorRef.detectChanges();
  }

  handleDropdownChange(caterer: Caterer): void {
    const selectedAction = caterer.selectedAction;
    this.updateFirestoreDocument(caterer, selectedAction);
  }


}
