import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-packages',
  templateUrl: './view-packages.component.html',
  styleUrls: ['./view-packages.component.css']
})
export class ViewPackagesComponent implements OnInit {
  caterers: Observable<any[]>;
  packages: Observable<any[]>; 
  
  loggedInUsername: string | null;

  // catererUid: string;
  catererUidToFetch: string | null = null; 
  catererData: any;

  selectedPackage: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {


    // Fetch the logged-in user's username
    this.loggedInUsername = authService.getLoggedInUsername();
    
  }

  ngOnInit(): void {
    
    this.caterers = this.firestore.collection('caterers').valueChanges();
    this.activatedRoute.paramMap.subscribe(params => {
      // Get the catererUid from paramMap
      this.catererUidToFetch = params.get('catererUid');
      console.log('Caterer UID to fetch:', this.catererUidToFetch);
      if (this.catererUidToFetch) {
        this.fetchCatererData();
      }
    });

    this.packages = this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        this.catererUidToFetch = params.get('catererUid');
        console.log('Caterer UID to fetch:', this.catererUidToFetch);
        return this.firestore.collection(`caterers/${this.catererUidToFetch}/packages`).valueChanges();
      })
    );

    // Subscribe to the packages observable and log the result
    this.packages.subscribe(fetchedPackages => {
      console.log('Fetched Packages:', fetchedPackages);
    });
  }

  onPackageSelect(selectedPackage: any) {
    // Deselect the previously selected package (if any)
    if (this.selectedPackage === selectedPackage) {
      this.selectedPackage = null;
      // console.log('Package deselected:', selectedPackage);
    } else {
      // Select the clicked package
      this.selectedPackage = selectedPackage;
      // console.log('Package selected:', selectedPackage);
    }
    
    // You can perform additional actions based on the selected package
  }

  fetchCatererData(): void {
    // this.catererUid = this.authService.getCatererUid();
    this.firestore.collection('caterers').doc(this.catererUidToFetch)
      .valueChanges()
      .subscribe((data) => {
        this.catererData = data;
        // console.log('Fetched Caterer Data:', this.catererData);
        console.log('Fetched Caterer Data:', this.catererData);
        // Check if packages exist in the data
        // Check if packages exist in the data
        if (this.catererData.catererBasicInfo.catererUid == this.catererUidToFetch) {
          // Fetching packages subcollection
          this.packages = this.firestore.collection('caterers').doc(this.catererUidToFetch)
            .collection('packages').valueChanges();
          console.log('Fetched Packages:', this.packages);
        }
      });
  }


}
