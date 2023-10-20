import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1); // Default to 31 days
  years: number[] = Array.from({ length: 122 }, (_, i) => new Date().getFullYear() - i); // For example, from the current year to 1900

  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/dashboard-user']);
  }

  populateDateDropdown() {
    const monthDropdown = document.getElementById('month') as HTMLSelectElement;
    const selectedMonth = monthDropdown.value;

    if (selectedMonth === 'February') {
      this.days = Array.from({ length: 28 }, (_, i) => i + 1); // Typically February has 28 days
      // Add logic for leap year if needed
    } else if (['April', 'June', 'September', 'November'].includes(selectedMonth)) {
      this.days = Array.from({ length: 30 }, (_, i) => i + 1); // These months have 30 days
    } else {
      this.days = Array.from({ length: 31 }, (_, i) => i + 1); // Default to 31 days
    }
  }
}
