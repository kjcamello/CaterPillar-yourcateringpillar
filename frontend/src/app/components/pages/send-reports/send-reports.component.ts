import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-send-reports',
  templateUrl: './send-reports.component.html',
  styleUrls: ['./send-reports.component.css']
})
export class SendReportComponent implements OnInit {
  selectedUserType: string = 'customer'; // Default selected user type
  customerName: string = '';
  catererName: string = '';
  reportDetails: string = '';
  wordCount: number = 0; // Initialize the wordCount variable

  selectedFile: File = null;
  fileDownloadUrl: string = null;
  selectedFileSrc: string = null;

  constructor(
    private storage: AngularFireStorage, 
    private afs: AngularFirestore, 
    private afAuth: AngularFireAuth) {}

  ngOnInit(): void {}

  limitWords(event: any): void {
    const MAX_WORDS = 100; // Maximum number of words allowed
    const words = event.target.value.trim().split(/\s+/); // Split the input text by spaces
    this.wordCount = words.length; // Update the word count

    if (words.length > MAX_WORDS) {
      // Truncate the input text to the maximum allowed words
      const truncatedText = words.slice(0, MAX_WORDS).join(' ');
      this.reportDetails = truncatedText; // Update the reportDetails variable with the truncated text
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async submitReport() {
    
    const reportedUsername = this.selectedUserType === 'customer' ? this.customerName : this.catererName;
  const userExists = await this.checkUserExistence(reportedUsername, this.selectedUserType);

  if (!userExists) {
    window.alert( reportedUsername +' does not exist or is not a ' + this.selectedUserType);
    return;
  }
  else{
try{
    if (!this.selectedUserType || !(this.customerName || this.catererName) || !this.reportDetails) {
      window.alert('Please fill in all necessary information.');
      return;
    }
  
    if (!this.selectedFile) {
      const confirmUpload = window.confirm('Are you sure you want to submit the report without uploading a file? Uploading a file can help in resolving the report.');
      if (!confirmUpload) {
        return;
      }
    }
  
    try {
      const user = await this.afAuth.currentUser;
      if (!user) {
        window.alert('Please log in to submit the report.');
        return;
      }
  
      const reporterEmail = user.email;
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      
  
      const reportData = {
        userType: this.selectedUserType,
        reporter: reporterEmail,
        reportedUsername: this.selectedUserType === 'customer' ? this.customerName : this.catererName,
        reportDetails: this.reportDetails,
        date: new Date().toLocaleString('en-PH', options),
        fileUrl: '', // Will be updated with the file URL after upload
      };
  
      const filename = `${reportData.reportedUsername}_report_proof`;
      const filePath = `reports/${this.selectedUserType}/${filename}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);
  
      task.snapshotChanges().pipe(
        finalize(async () => {
          const downloadURL = await fileRef.getDownloadURL().toPromise();
          reportData.fileUrl = downloadURL;
  
          this.afs.collection('reports').doc(this.selectedUserType).collection('details').add(reportData)
            .then(() => {
              console.log('Report submitted successfully.');
              window.alert('Report submitted successfully. \nRest assured we will do our best to provide you with the best catering experience');
              location.reload();
            })
            .catch((error) => {
              console.error('Error submitting report:', error);
              window.alert('Error submitting report:' + error.message);
            });
        })
      ).subscribe();
    } catch (error) {
      console.error('Error submitting report:', error);
      window.alert('Error submitting report:' + error.message);
    }
  }
  catch(error){
    console.error('Error submitting report:', error);
    window.alert('Error submitting report:' + error.message);
  }
}
  }
  
 

  async checkUserExistence(userName: string, userType: string): Promise<boolean> {
    try {
      let querySnapshot;
      if (userType === 'customer') {
        querySnapshot = await this.afs.collection('customers', ref => ref.where('userName', '==', userName)).get().toPromise();
      } else {
        querySnapshot = await this.afs.collection('caterers', ref => ref.where('catererBasicInfo.catererDisplayName', '==', userName)).get().toPromise();
      }
  
      return !querySnapshot.empty; // Check if the query results are empty
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }
  
  
  
}
