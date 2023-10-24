import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PackagemenuService } from 'src/app/services/packagemenu.service';
import * as bootstrap from 'bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-package-menu',
  templateUrl: './package-menu.component.html',
  styleUrls: ['./package-menu.component.css']
})
export class PackageMenuComponent implements OnInit {
  packageMenuForm: FormGroup;
  packages = [];
  userId: string;
  selectedPackageIds: string[] = [];
  sortingCriteria: string = 'packageName';
  sortingDirection: string = 'asc';
  selectedImage: File = null;
  imageDownloadUrl: string = null;
  selectedImageSrc: string = null;
  filteredPackages = [];
  searchTerm = '';
  eventOptions = ['Graduation', 'Wedding', 'Birthday', 'Despidida', 'Christening'];
  isUpdateMode: boolean = false;
  selectedPackageId: string;

  constructor(
    private fb: FormBuilder,
    private packageMenuService: PackagemenuService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.packageMenuForm = fb.group({
      packageName: [''],
      numofPax: [''],
      typeEvent: [''],
      appetizerFI: [''],
      soupFI: [''],
      saladFI: [''],
      mainCourseFI: [''],
      dessertFI: ['']
    });
  }

  ngOnInit() {
    this.fetchUserId();
    this.loadPackages();


    const modalElement = document.getElementById('exampleModal');
    modalElement.addEventListener('hidden.bs.modal', () => {
      this.packageMenuForm.reset();
      this.isUpdateMode = false;
      this.selectedPackageId = null;
    });


    this.selectedPackageIds = [];
    this.packages.forEach(packages => {
      packages.selected = false;
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImageSrc = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadImage() {
  if (this.selectedImage) {
    const imageName = uuidv4();
    const filePath = `package-menu-images/${imageName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedImage);

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            this.imageDownloadUrl = downloadURL;
            console.log('Image uploaded and URL:', this.imageDownloadUrl);
            this.updateTilesWithImage();
          });
        })
      )
      .subscribe(
        () => {
          console.log('Image upload task completed successfully.');
        },
        error => {
          console.error('Image upload error:', error);
        }
      );
  } else {
    console.error('No image selected for upload.');
  }
}

addPackage() {
  if (!this.packageMenuForm.valid) {
    alert('Please fill out all required fields correctly.');
    return;
  }

  this.uploadImage(); // Upload the selected image

  // Once the image is uploaded, continue with adding the package to the database
  const packageData = { ...this.packageMenuForm.value }; // Create a copy of the form data
  if (this.imageDownloadUrl) {
    packageData.imageUrl = this.imageDownloadUrl;
  }
  this.packageMenuService.addPackage(this.packageMenuForm.value, this.userId).then(() => {
    this.packageMenuForm.reset();
    // this.uploadImage().reset();
  });
}

  updateTilesWithImage() {
    if (this.imageDownloadUrl) {
      this.packages.forEach(pkg => {
        pkg.imageUrl = this.imageDownloadUrl;
      });
    }
  }

  loadPackages() {
    this.packageMenuService.getPackages(this.userId).subscribe(data => {
      this.packages = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as any
        };
      });
      this.filteredPackages = this.packages;
      this.sortPackages();
    });
  }

  sortPackages() {
    this.filteredPackages = [...this.packages]; // Create a copy
    this.filteredPackages.sort((a, b) => {
      const aValue = a[this.sortingCriteria].toLowerCase();
      const bValue = b[this.sortingCriteria].toLowerCase();

      if (this.sortingDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }

  onSortingCriteriaChange(criteria: string) {
    this.sortingCriteria = criteria;
    this.sortPackages();
  }

  onSortingDirectionChange(direction: string) {
    this.sortingDirection = direction;
    this.sortPackages();
  }

  updatePackage() {
    if (!this.packageMenuForm.valid) {
      alert('Please fill out all required fields correctly.');
      return;
    }
  
    const updatedPackage = this.packageMenuForm.value;
  
    // Add the imageUrl to the updatedPackage object if it's available
    if (this.imageDownloadUrl) {
      updatedPackage.imageUrl = this.imageDownloadUrl;
    }
  
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
  

  deletePackage(id) {
    if (confirm('Are you sure you want to delete this package?')) {
      this.packageMenuService.deletePackage(this.userId, id).then(() => {
        this.packages = this.packages.filter(packages => packages.id !== id);
        this.selectedPackageIds = this.selectedPackageIds.filter(selectedId => selectedId !== id);
      });
    }
  }

  openPackageModal(packages: any) {
    this.isUpdateMode = true;
    this.selectedPackageId = packages.id;
  
    // Set the form values
    this.packageMenuForm.setValue({
      packageName: packages.packageName,
      numofPax: packages.numofPax,
      typeEvent: packages.typeEvent,
      appetizerFI: packages.appetizerFI,
      soupFI: packages.soupFI,
      saladFI: packages.saladFI,
      mainCourseFI: packages.mainCourseFI,
      dessertFI: packages.dessertFI
    });
  
    // Set the selected image URL if available
    if (packages.imageUrl) {
      this.selectedImageSrc = packages.imageUrl;
    } else {
      // If imageUrl is not available, reset the selectedImageSrc to null
      this.selectedImageSrc = null;
    }
  
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
  }
  

  onSearch() {
    if (this.searchTerm) {
      this.filteredPackages = this.packages.filter(pkg =>
        pkg.packageName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.numofPax.toString().includes(this.searchTerm) ||
        pkg.typeEvent.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        // pkg.foodInclusion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.appetizerFI.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.soupFI.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.saladFI.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.mainCourseFI.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pkg.dessertFI.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredPackages = this.packages;
    }
  }

  fetchUserId() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadPackages();
      }
    });
  }

  toggleTileSelection(packages: any) {
    const packageId = packages.id;

    if (this.selectedPackageIds.includes(packageId)) {
      this.selectedPackageIds = this.selectedPackageIds.filter(id => id !== packageId);
    } else {
      this.selectedPackageIds.push(packageId);
    }

    packages.selected = !packages.selected;
  }

  hoverTile(packages: any) {
    packages.hovered = true;
  }

  unhoverTile(packages: any) {
    packages.hovered = false;
  }

  
}
