import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent  {
  
  customers: any; // Holds customer data
  otherGenderInput: string = ''; // Holds the input for 'other' gender
  selectedGender: string = ''; // Holds the selected gender
  selectedMonth: string = ''; // Holds the selected month
  selectedDate: number = null; // Holds the selected date
  selectedYear: number = null; // Holds the selected year
  bioStatement: string = ''; // Holds the bio statement
  foodLikes: string = ''; // Holds the food likes

  isEditable: boolean = false; // Flag for edit mode

  defaultCoverPhotoUrl: string = 'assets/user_cover_pic.jpg'; // Default cover photo URL
  defaultProfilePhotoUrl: string = 'assets/default_profilepic.png'; // Default profile photo URL

  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  years: number[] = Array.from({ length: 122 }, (_, i) => new Date().getFullYear() - i);

  selectedCoverImage: File = null; // Holds the selected cover image file
  selectedCoverImageSrc: string = null; // Holds the source for the selected cover image
  selectedProfileImage: File = null; // Holds the selected profile image file
  selectedProfileImageSrc: string = null; // Holds the source for the selected profile image
  selectedImage: File = null; // Holds the selected general image file
  selectedImageSrc: string = null; // Holds the source for the selected general image

  userProfileImageUrl: string = this.defaultProfilePhotoUrl; // Holds the URL of the user's profile image

  userCredentials = { username: '', password: '' }; // User credentials
  editMode: boolean = false; // Flag for edit mode
  isFieldDisabled: boolean = true; 
  constructor(
    private firestore: AngularFirestore, 
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
    
  ) {}

  ngOnInit(): void {
    this.fetchCustomerData();
    // this.fetchUserProfileImage();
   
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
            this.uploadProfileImage(file);
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
  uploadProfileImage(file: File) {
    const filePath = `profile_images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.updateUserProfileImage(url); // Update Firestore with the URL
        });
      })
    ).subscribe();
  }

  updateUserProfileImage(url: string) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userRef = this.firestore.collection('customers').doc(user.uid);
        userRef.update({ profileImageUrl: url })
          .then(() => console.log('Profile image updated successfully.'))
          .catch(error => console.error('Error updating profile image:', error));
      }
    });
  }
  // fetchUserProfileImage() {
  //   this.afAuth.authState.subscribe(user => {
  //     if (user) {
  //       const userRef = this.firestore.collection('customers').doc(user.uid);
  //       userRef.valueChanges().subscribe(userData => {
  //         if (userData && userData.profileImageUrl) { // Ensure this field name matches Firestore
  //           this.userProfileImageUrl = userData.profileImageUrl;
  //         } else {
  //           this.userProfileImageUrl = this.defaultProfilePhotoUrl; // Fallback to default image
  //         }
  //       });
  //     }
  //   });
  // }

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
  logout() {
    this.afAuth.signOut().then(() => {
      console.log('User logged out successfully');
      // Redirect the user to the login page or home page after logout
      // You can use Router for navigation
      // this.router.navigate(['/login']); // Uncomment and use as needed
    }).catch(error => {
      console.error('Error during logout:', error);
      // Handle any errors that occur during logout
    });
  }
}
