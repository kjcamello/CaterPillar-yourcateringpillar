import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PackagemenuService } from 'src/app/services/packagemenu.service';
import * as bootstrap from 'bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-package-menu',
  templateUrl: './package-menu.component.html',
  styleUrls: ['./package-menu.component.css']
})
export class PackageMenuComponent implements OnInit {
  packageMenuForm: FormGroup;
  packages = [];
  selectedPackage: any;  // Stores the clicked package details
  isUpdateMode: boolean = false;
  selectedPackageId: string; // Assuming you store the selected package ID here
  userId: string;

    // Add this property to your component class to store selected package IDs
  selectedPackageIds: string[] = [];

  filteredPackages = [];
  searchTerm = '';
  eventOptions = [
    'Graduation',
    'Wedding',
    'Birthday',
    'Despidida',
    'Christening',
  ];

  isEditMode: boolean = false;
  currentEditingId: string;

  constructor(private fb: FormBuilder, 
              private packageMenuService: PackagemenuService,
              private authService: AuthService,
              private afAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              ){
    this.packageMenuForm = fb.group({});
    //this.filteredPackages = this.packages;
  }

  ngOnInit() {
    this.fetchUserId();
    this.loadPackages();
    this.packageMenuForm = this.fb.group({
      packageName: [''],
      numofPax: [''],
      typeEvent: [''],
      foodInclusion: ['']
    });

    const modalElement = document.getElementById('exampleModal');
    modalElement.addEventListener('hidden.bs.modal', () => {
    this.packageMenuForm.reset();
    this.isUpdateMode = false;
    this.selectedPackageId = null; // also reset the selected package ID
  });

     // Reset selectedPackageIds and 'selected' property of packages
     this.selectedPackageIds = [];
     this.packages.forEach(packages => {
         packages.selected = false;
     });
    
  }

  addPackage() {
    if (!this.packageMenuForm.valid) {
      alert('Please fill out all required fields correctly.');
      return;
    }

    this.packageMenuService.addPackage(this.packageMenuForm.value, this.userId).then(() => {
      // Reset the form
      this.packageMenuForm.reset();
      this.loadPackages();
    });
  }

  loadPackages() {
    this.packageMenuService.getPackages(this.userId).subscribe(data => {
      this.packages = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as any
        };
      });
      //this.resetFilteredPackages();
      this.filteredPackages = this.packages;
    });
    //this.filteredPackages = this.packages;
  }

  resetFilteredPackages() {
    this.filteredPackages = this.packages.slice(); // Copy the packages array
  }

  updatePackage() {
    if (!this.packageMenuForm.valid) {
        alert('Please fill out all required fields correctly.');
        return;
    }

    const updatedPackage = this.packageMenuForm.value;

    // Use the service to update the package in Firestore
    this.packageMenuService.updatePackage(this.userId, this.selectedPackageId, updatedPackage).then(
        () => {
            // Refresh your table or list to reflect the updated data
            this.loadPackages(); 

            alert('Package updated successfully!');
        },
        error => {
            console.error('There was an error updating the package:', error);
            alert('There was an error updating the package. Please try again later.');
        }
    );
  }

// Modify the deletePackage method to remove selected packages from the list
deletePackage(id) {
  if (confirm("Are you sure you want to delete this package?")) {
      this.packageMenuService.deletePackage(this.userId, id).then(() => {
          // Remove the deleted package from the 'packages' array
          this.packages = this.packages.filter(packages => packages.id !== id);
          
          // Remove the package ID from the selectedPackageIds array
          this.selectedPackageIds = this.selectedPackageIds.filter(selectedId => selectedId !== id);
      });
  }
}

  openPackageModal(packages: any) {
    this.isUpdateMode = true;
    this.selectedPackageId = packages.id; // set the ID of the selected package
    // Set the form values
    this.packageMenuForm.setValue({
      packageName: packages.packageName,
      numofPax: packages.numofPax,
      typeEvent: packages.typeEvent,
      foodInclusion: packages.foodInclusion
    });
  
    // Open the modal
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
  }

  onSearch() {
    if (this.searchTerm) {
      this.filteredPackages = this.packages.filter(pkg => 
        pkg.packageName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.numofPax.toString().includes(this.searchTerm) ||
        pkg.typeEvent.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.foodInclusion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredPackages = this.packages;
      //this.resetFilteredPackages();
    }
  }
  fetchUserId() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        //this.filteredPackages = this.packages;
        this.loadPackages();
      }
    });
  }

// Modify the toggleTileSelection method to toggle the selection of a package
toggleTileSelection(packages: any) {
    const packageId = packages.id;
    
    // Check if the package is already selected
    if (this.selectedPackageIds.includes(packageId)) {
        // Deselect the package by removing its ID from the selectedPackageIds array
        this.selectedPackageIds = this.selectedPackageIds.filter(id => id !== packageId);
    } else {
        // Select the package by adding its ID to the selectedPackageIds array
        this.selectedPackageIds.push(packageId);
    }
    
    // Update the 'selected' property of the package to apply/remove the CSS class
    packages.selected = !packages.selected;
}

// Modify the hoverTile method to handle hovering over a package tile
hoverTile(packages: any) {
  packages.hovered = true;
}

// Modify the unhoverTile method to handle unhovering a package tile
unhoverTile(packages: any) {
  packages.hovered = false;
  }
}
