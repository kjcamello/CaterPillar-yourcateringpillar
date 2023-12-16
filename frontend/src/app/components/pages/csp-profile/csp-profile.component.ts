import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-csp-profile',
  templateUrl: './csp-profile.component.html',
  styleUrls: ['./csp-profile.component.css']
})
export class CspProfileComponent {
  caterer: any;
  selectedCoverImage: File = null; // Holds the selected cover image file
  selectedCoverImageSrc: string = null; // Holds the source for the selected cover image
  selectedProfileImage: File = null; // Holds the selected profile image file
  selectedProfileImageSrc: string = null; // Holds the source for the selected profile image
  selectedImage: File = null; // Holds the selected general image file
  selectedImageSrc: string = null; // Holds the source for the selected general image
  
  // userProfileImageUrl: string = this.defaultProfilePhotoUrl; // Holds the URL of the user's profile image

  userCredentials = { username: '', password: '' }; // User credentials
  editMode: boolean = false; // Flag for edit mode
  isFieldDisabled: boolean = true; 

  showBasicInfoSection: boolean = true;
  showCateringInfoSection: boolean = false;

  showBasicInfo(): void {
    this.showBasicInfoSection = true;
    this.showCateringInfoSection = false;
  }

  showCateringInfo(): void {
    this.showBasicInfoSection = false;
    this.showCateringInfoSection = true;
  }

  constructor(
    private firestore: AngularFirestore, 
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
    ){}

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
            // this.uploadProfileImage(file); // Uploads the profile image
            break;
          // ... other cases ...
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
