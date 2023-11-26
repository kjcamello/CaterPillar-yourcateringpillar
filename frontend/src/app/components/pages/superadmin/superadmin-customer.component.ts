import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { UserAuthService } from 'src/app/services/userauth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es'



export interface Caterer {
  id: string;
  catererDisplayName: string;
  catererEmail: string;
  status: string;
  remarks: string;
  selectedAction: string; 
  selectedRemark: string;// Add this property
}

@Component({
  selector: 'app-superadmin-customer',
  templateUrl: './superadmin-customer.component.html',
  styleUrls: ['./superadmin-customer.component.css'],
})
export class SuperadminCustomerComponent implements OnInit {

  loggedInCustomers$: any[] = [];
  caterers: Caterer[] = [];
  displayedColumns: string[] = ['status', 'catererDisplayName', 'catererEmail'];
  firestore: any;
  afAuth: any;
  searchTerm: string = '';
  filteredCaterers: Caterer[] = [];
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
      this.applySearchFilter();
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
  
    // Use Lodash for sorting
    this.caterers = _.orderBy(this.caterers, [column], [this.sortOrder]);
    this.filteredCaterers = this.sortOrder === 'asc'
      ? this.filteredCaterers.sort((a, b) => {
          const valA = this.getPropertyValue(a, column);
          const valB = this.getPropertyValue(b, column);
          return valA.localeCompare(valB);
        })
      : this.filteredCaterers.sort((a, b) => {
          const valA = this.getPropertyValue(a, column);
          const valB = this.getPropertyValue(b, column);
          return valB.localeCompare(valA);
        });
  }
  getPropertyValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : ''), obj);
  }
  applySearchFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredCaterers = [...this.caterers];
      return;
    }

    const searchStr = this.searchTerm.toLowerCase().trim();
    this.filteredCaterers = this.caterers.filter((caterer) => {
      return (
        this.getPropertyValue(caterer, 'catererBasicInfo.catererDisplayName')
          .toLowerCase()
          .includes(searchStr) ||
        this.getPropertyValue(caterer, 'catererBasicInfo.catererEmail').toLowerCase().includes(searchStr) ||
        caterer.remarks.toLowerCase().includes(searchStr) ||
        caterer.status.toLowerCase().includes(searchStr)
      );
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
