import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserAuthService } from 'src/app/services/userauth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit {

  loggedInCustomers$: any[] = [];
  customers: any [];
  

  displayedColumns: string[] = ['uid', 'username', 'email', 'address'];
  firestore: any;
  afAuth: any;
  
  constructor(
    public userauthService: UserAuthService,
    private afs: AngularFirestore    
    ) {}

  ngOnInit() {
    this.userauthService.getUsers().subscribe((loggedInCustomers) => {
      this.customers = loggedInCustomers;
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


}


    // Fetch caterer data from Firestore
    

  // Function to change the status and update the reason
  
