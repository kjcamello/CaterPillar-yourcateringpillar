import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from 'src/app/services/userauth.service';
import { MatDialog } from '@angular/material/dialog';
import { ReasonDialogComponent } from 'src/app/components/pages/superadmin/reason-dialog/reason-dialog.component';

export interface Caterer {
  catererDisplayName: string;
  catererEmail: string;
  status: string;
  selectedAction: string; 
  remarks: string;// Add this property
}

@Component({
  selector: 'app-superadmin-customer',
  templateUrl: './superadmin-customer.component.html',
  styleUrls: ['./superadmin-customer.component.css']
})
export class SuperadminCustomerComponent implements OnInit {

  caterers: Caterer[] = [];

  displayedColumns: string[] = ['status', 'catererDisplayName', 'catererEmail'];

  constructor(public userauthService: UserAuthService, private dialog: MatDialog) {}

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

  handleDropdownChange(caterer: Caterer): void {
    const selectedAction = caterer.selectedAction;
    const availableActions = this.getAvailableActions(caterer.status);

    if (availableActions.includes(selectedAction)) {
      // Open the reason dialog
      const dialogRef = this.dialog.open(ReasonDialogComponent, {
        width: '250px',
        data: { title: 'Reason Dialog', message: 'Enter reason:' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Proceed with the entered reason
          console.log(`Selected action for ${caterer.catererDisplayName}: ${selectedAction}`);
          console.log(`Reason entered: ${result}`);

          // Update status and remarks in caterer
          caterer.status = selectedAction === 'Enable' ? 'Active' : selectedAction;
          caterer.remarks = result;
        } else {
          console.log('Dialog closed without proceeding.');
          // Handle cancel action
        }
      });
    } else {
      console.log(`Invalid action selected: ${selectedAction}`);
    }
  }
}
