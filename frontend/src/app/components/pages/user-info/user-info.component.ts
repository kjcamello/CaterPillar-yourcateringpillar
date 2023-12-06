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
  otherGenderInput: string = ''; // This will hold the input for 'other' gender
  selectedGender: string = ''; // Initialize it to an empty string
  selectedMonth: string = ''; // Initialize it to an empty string
  selectedDate: number = null; // Initialize it to null
  selectedYear: number = null; // Initialize it to null
  bioStatement: string = ''; // Initialize it to an empty string
  foodLikes: string = ''; // Initialize it to an empty string

  isEditable: boolean = false;

  defaultCoverPhotoUrl: string = 'assets/user_cover_pic.jpg';
  defaultProfilePhotoUrl: string = 'assets/default_profilepic.png';

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
  enableEditMode() {
    this.isEditable = !this.isEditable;
  }
  saveUserProfile() {
    // Check if a user is authenticated
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Get a reference to the user's document in Firestore
        const userRef = this.firestore.collection('customers').doc(user.uid);

        // Prepare the data to be saved
        const userData = {
          userName: this.customers.userName, // Assuming this is bound to an input field
          email: this.customers.email, // Assuming this is bound to an input field
          phone: this.customers.phone, // Assuming this is bound to an input field
          address: this.customers.address, // Assuming this is bound to an input field
          gender: this.selectedGender,
          dateOfBirth: {
            month: this.months.indexOf(this.selectedMonth) + 1,
            date: this.selectedDate,
            year: this.selectedYear
          },
          bioStatement: this.bioStatement,
          foodLikes: this.foodLikes
          // Add any other fields you need to save
        };

        // Update the Firestore document with the user's details
        userRef.update(userData)
          .then(() => {
            console.log('User profile saved successfully.');
            // Handle successful save, e.g., show a success message
          })
          .catch(error => {
            console.error('Error saving user profile:', error);
            // Handle errors, e.g., show an error message
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
        const userRef = this.firestore.collection('customers').doc(user.uid);
        userRef.valueChanges().subscribe(data => {
          this.customers = data;
          this.setFormValues(data); // Set form values based on fetched data
        });
      }
    });
  }
  setFormValues(data: any) {
    if (data) {
      // Set gender
      this.selectedGender = data.gender;

      // Set date of birth if available
      if (data.dateOfBirth) {
        this.selectedMonth = this.months[data.dateOfBirth.month - 1];
        this.selectedDate = data.dateOfBirth.date;
        this.selectedYear = data.dateOfBirth.year;
      }

      // Set other fields like bioStatement, foodLikes, etc.
      this.bioStatement = data.bioStatement;
      this.foodLikes = data.foodLikes;
      // ... set other fields as needed ...
    }
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
    // Find the index of the selected month in the months array
    const monthIndex = this.months.indexOf(this.selectedMonth);
  
    // Initialize the number of days based on the selected month
    let numberOfDays: number;
  
    switch (this.selectedMonth) {
      case 'February':
        // Check for leap year
        const isLeapYear = this.selectedYear % 4 === 0 && (this.selectedYear % 100 !== 0 || this.selectedYear % 400 === 0);
        numberOfDays = isLeapYear ? 29 : 28;
        break;
      case 'April':
      case 'June':
      case 'September':
      case 'November':
        numberOfDays = 30;
        break;
      default:
        numberOfDays = 31;
        break;
    }
  
    // Update the 'days' array with the correct number of days
    this.days = Array.from({ length: numberOfDays }, (_, i) => i + 1);
  }
  onEditClicked(): void {
    const editButton = document.querySelector('.edit-btn') as HTMLElement;
    const saveButton = document.querySelector('.save-btn') as HTMLElement;

    if (editButton && saveButton) {
      editButton.style.marginLeft = '254px';
      saveButton.style.visibility = 'visible';
    }
    this.isEditable = true;
  }
  onSaveClicked(): void {
    const editButton = document.querySelector('.edit-btn') as HTMLElement;
    const saveButton = document.querySelector('.save-btn') as HTMLElement;

    if (editButton && saveButton) {
      editButton.style.marginLeft = '481px';
      saveButton.style.visibility = 'hidden';
    }
    this.isEditable = false;
    this.confirmSaveChanges();
  }
  onGenderChange(): void {
    const otherRadio = document.getElementById('others');
    const genderInput = document.getElementById('otherGender');
    if (this.selectedGender === 'otherRadio') {
      genderInput.style.visibility = 'visible';
    } 
  }
}
