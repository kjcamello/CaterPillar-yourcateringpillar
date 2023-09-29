import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
// import * as catererDataService from 'src/app/services/caterer-data.service;
import { CatererDataService } from 'src/app/services/caterer-data.service';

@Component({
  selector: 'app-cateringinformation',
  templateUrl: './cateringinformation.component.html',
  styleUrls: ['./cateringinformation.component.css']
})
export class CateringinformationComponent implements OnInit{
  cateringInfo: any = {};
  catererInfo: any = {};
  constructor(private authService: AuthService){

  }
  ngOnInit(): void {
      
  }
  

  currentStep = 1;
  

  isStep2: boolean = false;


  checkIsStep2() {
    this.isStep2 = this.currentStep === 2;
  }

  goToNextStep(): void {
    if (this.currentStep < 2) { 
      this.currentStep++;
      this.checkIsStep2();
    } else {
      
    }
  }
  goToPreviousStep(): void {
    if (this.currentStep > 1) { 
      this.currentStep--;
      this.checkIsStep2();
    } else {
      
    }
  }
  saveInformation() {
    if (this.currentStep === 2) {
      const catererUid = this.authService.getCatererUid();

      if (catererUid) {
        this.authService.saveCateringData(catererUid, this.cateringInfo, this.catererInfo)
          .then(() => {
            console.log("Catering and Caterer Information saved successfully!");
          })
          .catch(error => {
            console.error("Error saving Information: ", error);
          });

          alert('CaterPillar Created');
          return;
      } else {
        console.error("No caterer UID available!");
      }
    }
  }
}
