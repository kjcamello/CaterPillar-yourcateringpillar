import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from 'src/app/services/userauth.service';



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
  
  constructor(public userauthService: UserAuthService) {}

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



  deleteUser(userId: number) {
    // Implement your delete logic here
    console.log(`Deleting user with ID: ${userId}`);
  }

  blockUser(userId: number) {
    // Implement your block logic here
    console.log(`Blocking user with ID: ${userId}`);
  }
}
    // Fetch caterer data from Firestore
    

  // Function to change the status and update the reason
  
