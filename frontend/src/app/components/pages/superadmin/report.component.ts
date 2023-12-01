import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from 'src/app/services/adminauth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  customerReports: any[] = []; // Define an array to hold customer reports
  catererReports: any[] = []; // Define an array to hold caterer reports

  showCustomerReports = true;
  showCatererReports = false;

  constructor(private adminauthservice: AdminAuthService, private router:Router) {}

  ngOnInit() {
    // Fetch customer reports from your backend
    this.adminauthservice.getCustomerReports().subscribe((reports) => {
      this.customerReports = reports;
    });

    // Fetch caterer reports from your backend
    this.adminauthservice.getCatererReports().subscribe((reports) => {
      this.catererReports = reports;
    });

  }

  goToStatus(reportedUsername: string, userType: string) {
    const queryParams = { reportedUsername }; // Create queryParams object with reportedUsername
  
    if (userType === 'caterer') {
      this.router.navigate(['/superadmin-customer'], { queryParams }); // Navigate to the Superadmin Customer route with queryParams
    } else if (userType === 'customer') {
      this.router.navigate(['/superadmin'], { queryParams }); // Navigate to the Superadmin route with queryParams
    }
  }

  toggleRow(report: any): void {
    report.expanded = !report.expanded;
}
}
