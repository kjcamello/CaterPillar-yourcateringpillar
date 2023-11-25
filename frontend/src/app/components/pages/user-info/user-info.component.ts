import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms'; // Import FormGroup if you're using reactive forms
// import { AngularFirestore } from '@angular/fire/firestore';
// import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent  {
  customer: any;

  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  years: number[] = Array.from({ length: 122 }, (_, i) => new Date().getFullYear() - i);

  selectedCoverImage: File = null;
  selectedCoverImageSrc: string = null;
  selectedProfileImage: File = null;
  selectedProfileImageSrc: string = null;
  selectedImage: File = null;
  selectedImageSrc: string = null;

  userCredentials = { username: '', password: '' };
  editMode: boolean = false;
  isFieldDisabled: boolean = true;
  myForm: FormGroup; // Declare this if using reactive forms

  constructor(
    private router: Router,
    // private firestore: AngularFirestore, 
    // private afAuth: AngularFireAuth
  ) { }

  // ngOnInit(): void {
  //   this.fetchCustomerData();
  // }

  // fetchCustomerData() {
  //   this.afAuth.authState.subscribe(user => {
  //     if (user) {
  //       const customerRef = this.firestore.collection('customers').doc(user.uid);
  //       customerRef.valueChanges().subscribe(data => {
  //         this.customer = data;
  //       });
  //     }
  //   });
  // }

  enableEditMode() {
    this.editMode = true;
    this.isFieldDisabled = false;
    if (this.myForm) {
      this.myForm.enable();
    }
  }

  saveChanges() {
    if (this.myForm) {
      const formData = this.myForm.value;
      console.log('Saving changes...', formData);
      this.myForm.reset();
    }
    this.editMode = false;
    this.isFieldDisabled = true;
  }

  onSubmit() {
    console.log('User Credentials:', this.userCredentials);
  }

  onCoverImageSelected(event: any) {
    this.handleImageSelection(event, 'cover');
  }

  onProfileImageSelected(event: any) {
    this.handleImageSelection(event, 'profile');
  }

  onImageSelected(event: any) {
    this.handleImageSelection(event, 'general');
  }

  handleImageSelection(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        switch (type) {
          case 'cover':
            this.selectedCoverImage = file;
            this.selectedCoverImageSrc = e.target.result;
            break;
          case 'profile':
            this.selectedProfileImage = file;
            this.selectedProfileImageSrc = e.target.result;
            break;
          case 'general':
            this.selectedImage = file;
            this.selectedImageSrc = e.target.result;
            break;
        }
      };
      reader.readAsDataURL(file);
    }
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
