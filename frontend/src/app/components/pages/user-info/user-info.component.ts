import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1); // Default to 31 days
  years: number[] = Array.from({ length: 122 }, (_, i) => new Date().getFullYear() - i); // For example, from the current year to 1900

  selectedCoverImage: File = null;
  selectedCoverImageSrc: string = null;
  selectedProfileImage: File = null;
  selectedProfileImageSrc: string = null;

  selectedImage: File=null;
  selectedImageSrc:  string = null;

  userCredentials = {
    username: '',
    password: ''
  };
  onSubmit() {
    // Process login here
    console.log('User Credentials:', this.userCredentials);
  }

  onCoverImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedCoverImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedCoverImageSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  onProfileImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfileImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProfileImageSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/dashboard-user']);
  }
  
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImageSrc = e.target.result;
    };
    reader.readAsDataURL(file);
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
  // logout() {
  //   this.AuthSer.SignOut();
  //   // Redirect or handle post-logout logic here
  // }
}

