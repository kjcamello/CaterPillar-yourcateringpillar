import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from 'src/app/services/userauth.service';

export interface Caterer {
  catererDisplayName: string;
  catererEmail: string;
  status: string;
  selectedAction: string; // Add this property
}

@Component({
  selector: 'app-superadmin-customer',
  templateUrl: './superadmin-customer.component.html',
  styleUrls: ['./superadmin-customer.component.css']
})
export class SuperadminCustomerComponent implements OnInit {

  caterers: Caterer[] = [];

  displayedColumns: string[] = ['status', 'catererDisplayName', 'catererEmail'];

  constructor(public userauthService: UserAuthService) {}

  ngOnInit() {
    this.userauthService.getCaterers().subscribe((loggedInCustomers) => {
      this.caterers = loggedInCustomers.map(caterer => {
        caterer.selectedAction = ''; // Initialize selectedAction
        return caterer;
      });
      console.log(this.caterers);
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

  // Function to handle dropdown change
  handleDropdownChange(caterer: Caterer): void {
    // Implement your logic based on the selected action
    console.log(`Selected action for ${caterer.catererDisplayName}: ${caterer.selectedAction}`);
  }
}
