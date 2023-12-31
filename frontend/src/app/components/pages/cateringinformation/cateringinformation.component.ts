import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CatererSignUpComponent } from '../caterer-sign-up/caterer-sign-up.component';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
// import * as catererDataService from 'src/app/services/caterer-data.service;
// import { CatererDataService } from 'src/app/services/caterer-data.service';

@Component({
  selector: 'app-cateringinformation',
  templateUrl: './cateringinformation.component.html',
  styleUrls: ['./cateringinformation.component.css']
})
export class CateringinformationComponent implements OnInit{
  
  defaultcatererEmail: string | null = null;
  tinFile: File | null = null;

  currentStep = 1;
  catererEmailDefault: string = '';
  cateringInfo = {
    cateringName: '',
    cateringAddress: '',
    cateringEmail: '',
    cateringContactNumber: ''
  };
  catererInfo = {
    catererRegisteredName: '',
    catererRegisteredAddress: '',
    hasTIN: '',
    tinFileURL: '' 
  };
  constructor(
    private firestore: AngularFirestore, 
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private authService : AuthService,
    private storage: AngularFireStorage,
    private router: Router
  ){}
  ngOnInit(){
    // this.route.queryParamMap.subscribe(params => {
    //   this.catererEmailDefault = params.get('catererDefaultEmail');
    // });
    // this.cateringInfo.cateringEmail = this.catearerEmailDefault;
    this.authService.currentEmail.subscribe(email => {
      this.catererEmailDefault = email;
      this.cateringInfo.cateringEmail = email; // Setting the email to cateringInfo.cateringEmail directly
    });
  }
  
  goToPreviousStep() {
    this.currentStep -= 1;
  }

  goToNextStep(): void {
    const phoneNumberPattern = /^(09|\+639)\d{9}$/;
    if (this.currentStep === 1) {
      if (!this.cateringInfo.cateringName || !this.cateringInfo.cateringAddress || !this.cateringInfo.cateringContactNumber) {
        alert('Please fill all the fields in Catering Information.');
        return;
      }
      if (!phoneNumberPattern.test(this.cateringInfo.cateringContactNumber)) {
        alert('Please enter a valid contact number format.');
        return;
      }
      this.currentStep++; // Proceed to next step
    }
  }

  async saveInformation() {
    const caterer = await this.afAuth.currentUser;
  
    if (!caterer) {
      console.error('Caterer not authenticated');
      return;
    }
  
    const catererUid = caterer.uid;
    const catererRef = this.firestore.collection('caterers').doc(catererUid);
  
    if (!this.catererInfo.catererRegisteredName || !this.catererInfo.catererRegisteredAddress || !this.catererInfo.hasTIN) {
      alert('Please fill all the fields in Caterers Information.');
      return;
    }
  
    if (this.catererInfo.hasTIN === 'Yes' && !this.catererInfo.tinFileURL) {
      alert('Please upload the TIN proof.');
      return;
    }
  
    if (this.tinFile) {
      // Construct a file path e.g., 'tins/userID_filename'
      const filePath = `tins/${catererUid}_${this.tinFile.name}`;
      const fileRef = this.storage.ref(filePath);
  
      // Upload the file to Firebase Storage
      this.storage.upload(filePath, this.tinFile).snapshotChanges().pipe(
        finalize(() => {
          // Get the download URL after the file is uploaded successfully
          fileRef.getDownloadURL().subscribe((url) => {
            // Update catererInfo to include the file URL
            this.catererInfo.tinFileURL = url;
  
            // Save the updated catererInfo and cateringInfo to Firestore
            catererRef.set({
              catererBasicInfo: {
                catererUid: catererUid
              },
              catererInfo: this.catererInfo,
              cateringInfo: this.cateringInfo
            }, { merge: true }).then(() => {
              console.log('Information saved successfully!');
              this.router.navigate(['dashboard-caterer']);
            }).catch(error => {
              console.error('Error saving information:', error);
            });
          });
        })
      ).subscribe();
    } else {
      // Handle saving information without TIN file
      catererRef.set({
        catererBasicInfo: {
          catererUid: catererUid
        },
        catererInfo: this.catererInfo,
        cateringInfo: this.cateringInfo
      }, { merge: true }).then(() => {
        console.log('Information saved successfully!');
        this.router.navigate(['dashboard-caterer']);
      }).catch(error => {
        console.error('Error saving information:', error);
      });
    }
  }
  
  onTINFileChange(event: any) {
    if (event.target.files.length > 0) {
        this.tinFile = event.target.files[0];
    } else {
        this.tinFile = null;
    }
}
}
