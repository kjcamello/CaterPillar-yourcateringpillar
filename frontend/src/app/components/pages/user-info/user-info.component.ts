import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent  {
 
  customers: any;
  selectedGender: string = ''; // Initialize it to an empty string
  selectedMonth: string = ''; // Initialize it to an empty string
  selectedDate: number = null; // Initialize it to null
  selectedYear: number = null; // Initialize it to null
  bioStatement: string = ''; // Initialize it to an empty string
  foodLikes: string = ''; // Initialize it to an empty string
  selectedDateOfBirth = null;

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

  constructor(
    private firestore: AngularFirestore, 
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.fetchCustomerData();
  }

  saveUserProfile() {
    // Check if a user is authenticated
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Get a reference to the user's document in Firestore
        const userRef = this.firestore.collection('customers').doc(user.uid);
  
        // Format the selected date values as a JavaScript Date object
        const selectedDateOfBirth = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth), this.selectedDate);
  
        // Update the Firestore document with the user's details
        userRef.update({
          gender: this.selectedGender,
          dateOfBirth: selectedDateOfBirth, // Use the formatted Date object
          bioStatement: this.bioStatement,
          foodLikes: this.foodLikes
        })
          .then(() => {
            console.log('User profile saved successfully.');
          })
          .catch(error => {
            console.error('Error saving user profile:', error);
          });
      }
    });
  }

  confirmSaveChanges() {
    const confirmSave = confirm('Do you want to save your changes?');
    if (confirmSave) {
      this.saveUserProfile(); // Call the saveUserProfile function if confirmed
    }
  }

  fetchCustomerData() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const catererRef = this.firestore.collection('customers').doc(user.uid);
        catererRef.valueChanges().subscribe(data => {
          this.customers = data;
        });
      }
    });
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
    // Get references to the dropdown elements
    const monthDropdown = document.getElementById('month') as HTMLSelectElement;
    const selectedDayDropdown = document.getElementById('date') as HTMLSelectElement;
    const selectedYearDropdown = document.getElementById('year') as HTMLSelectElement;
  
    // Retrieve the selected values from the dropdowns
    const selectedMonth = monthDropdown.value;
    const selectedDay = parseInt(selectedDayDropdown.value, 10); // Parse to integer
    const selectedYear = parseInt(selectedYearDropdown.value, 10); // Parse to integer
  
    // Find the index of the selected month in the months array
    const monthIndex = this.months.findIndex(month => month === selectedMonth);
  
    // Initialize the number of days based on the selected month
    let numberOfDays: number;
  
    switch (selectedMonth) {
      case 'February':
        numberOfDays = 28; // Typically February has 28 days
        // Add logic for leap year if needed
        break;
      case 'April':
      case 'June':
      case 'September':
      case 'November':
        numberOfDays = 30; // These months have 30 days
        break;
      default:
        numberOfDays = 31; // Default to 31 days for other months
        break;
    }
  
    // Update the 'days' array with the correct number of days
    this.days = Array.from({ length: numberOfDays }, (_, i) => i + 1);
  
    // If all fields are selected and valid, create the Date of Birth
    if (!isNaN(selectedDay) && !isNaN(selectedYear) && monthIndex !== -1) {
      const month = monthIndex + 1; // Months are 1-based in JavaScript Date objects
      this.selectedDateOfBirth = new Date(selectedYear, month - 1, selectedDay); // Subtract 1 from month
    } else {
      this.selectedDateOfBirth = null; // Reset the Date of Birth if any field is empty
    }
  }
}