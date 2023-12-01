import { Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserAuthService } from 'src/app/services/userauth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

export interface Caterer {
  id: string;
  catererDisplayName: string;
  catererEmail: string;
  status: string;
  reason: string;
}

export interface Customer {
  uid: string; 
  userName: string;
  email: string;
  address?:string;
  phone?: bigint;
  status: string;
}



@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})

export class SuperadminComponent implements OnInit {

  loggedInCustomers$: any[] = [];
  customers: Customer[];
  displayedColumns: string[] = ['uid', 'username', 'email', 'address'];
  firestore: any;
  afAuth: any;
  searchTerm: string = '';
  sortOrder: string = 'asc'; // 'asc' for ascending, 'desc' for descending
  sortByColumn: string = 'userName'; // Default sorting column
  
  constructor(
    public userauthService: UserAuthService,
    private afs: AngularFirestore,
    private route : ActivatedRoute    
    ) {}

  ngOnInit() {
    this.userauthService.getUsers().subscribe((loggedInCustomers) => {
      this.loggedInCustomers$ = loggedInCustomers;
      this.applySearchFilter(); 
    });
    this.route.queryParams.subscribe((params) => {
      const reportedUsername = params['reportedUsername'];
      if (reportedUsername) {
        this.searchTerm = reportedUsername; // Set searchTerm to reportedUsername
        this.applySearchFilter(); // Apply the search filter
      }
    });
  }

  sortBy(column: string): void {
    if (this.sortByColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOrder = 'asc';
    }
  
    this.sortByColumn = column;
  
    this.customers.sort((a, b) => {
      const aValue = a[column].toLowerCase();
      const bValue = b[column].toLowerCase();
  
      if (this.sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }

  getUsers() {
    this.userauthService.getUsers().subscribe((loggedInCustomers) => {
      this.loggedInCustomers$ = loggedInCustomers;
    });
  }
  
  getUserStatus(uid: string): Observable<string> {
    return this.afs.collection('users').doc(uid).valueChanges()
      .pipe(map((user: any) => user.status || 'Inactive'));
  }
  
  
  async deleteUser(uid: string): Promise<void> {
    try {
      // Step 1: Delete the user from Firebase Firestore 'customers' collection
      await this.afs.collection('customers').doc(uid).delete();
  
      // Step 2: Delete the user from Firebase Authentication
      const user = await this.afAuth.currentUser;
      if (user) {
        await user.delete();
      }
  
      console.log(`User with ID ${uid} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting user with ID ${uid}:`, error);
      throw error; // Re-throw the error to handle it in the calling code if needed
    }
  }
  
  
  
  
  confirmDisableUser(uid: string): void {
    const confirmation = window.confirm('Are you sure you want to disable this user?');
  
    if (confirmation) {
      // User clicked 'OK', proceed with disabling the user
      this.disableUserAction(uid);
    } else {
      // User clicked 'Cancel', do nothing
      console.log('User cancellation');
    }
  }
  
  // Function to disable the user
  async disableUserAction(uid: string): Promise<void> {
    try {
      // Update the user's status to 'disabled' in the 'customers' collection
      await this.afs.collection('customers').doc(uid).update({ status: 'Inactive' });
  
      console.log(`User with ID ${uid} disabled successfully.`);
    } catch (error) {
      console.error(`Error disabling user with ID ${uid}:`, error);
      throw error; // Re-throw the error to handle it in the calling code if needed
    }
  }
  
  confirmUnblockUser(uid: string): void {
    const confirmation = window.confirm('Are you sure you want to unblock this user?');
  
    if (confirmation) {
      // User clicked 'OK', proceed with unblocking the user
      this.unblockUserAction(uid);
    } else {
      // User clicked 'Cancel', do nothing
      console.log('User unblock cancellation');
    }
  }
  
  async unblockUserAction(uid: string): Promise<void> {
    try {
      // Update the user's status to 'active' in the 'customers' collection
      await this.afs.collection('customers').doc(uid).update({ status: 'Active' });
  
      console.log(`User with ID ${uid} unblocked successfully.`);
    } catch (error) {
      console.error(`Error unblocking user with ID ${uid}:`, error);
      throw error; // Re-throw the error to handle it in the calling code if needed
    }
  }
  
  login(email: string, password: string): void {
    this.userauthService.login(email, password);
  }

  // Inside SuperadminComponent

// Function to filter users
applySearchFilter(): void {
  if (!this.searchTerm.trim()) {
    this.customers = this.loggedInCustomers$;
    return;
  }

  const searchStr = this.searchTerm.toLowerCase().trim();
  this.customers = this.loggedInCustomers$.filter((customer) =>
    customer.userName.toLowerCase().includes(searchStr) ||
    customer.email.toLowerCase().includes(searchStr)
  );
}



}
