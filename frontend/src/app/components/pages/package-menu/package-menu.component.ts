import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PackagemenuService } from 'src/app/services/packagemenu.service';
import * as bootstrap from 'bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ShareDataService } from 'src/app/services/share-data.service';
import { ServiceTypeService } from 'src/app/services/service-type.service';

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
  
  selectedImage: File = null;
  imageDownloadUrl: string = null;
  selectedImageSrc: string = null;
  filteredPackages: any[]= [];
  searchTerm = '';
  // eventOptions = ['Graduation', 'Wedding', 'Birthday', 'Despidida', 'Christening'];
  isUpdateMode: boolean = false;
  selectedPackageId: string;

  sortingCriteria: string = 'packageName';
  sortingDirection: string = 'asc';

    // Create properties for select options
    eventOptions: any[] = [];
    appetizerOptions: any[] = [];
    soupOptions: any[] = [];
    saladOptions: any[] = [];
    mainCourseOptions: any[] = [];
    dessertOptions: any[] = [];
    drinkOptions: any[] = [];

    selectedAppetizers: any[] = [];
    selectedSoups: any[] = [];
    selectedSalads: any[] = [];
    selectedMainCourses: any[] = [];
    selectedDesserts: any[] = [];
    selectedDrinks: any[] = [];

  constructor(
    private fb: FormBuilder,
    private packageMenuService: PackagemenuService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private sharedDataService: ShareDataService,
    private serviceType: ServiceTypeService
  ) {
    // Initialize your form group
    this.packageMenuForm = this.fb.group({
      packageName: ['', Validators.required],
      numofPax: ['', Validators.required],
      typeEvent: ['', Validators.required],
      // ... other form controls ...

      // Add form arrays for each category
      // appetizers: this.fb.array([]),
      // soups: this.fb.array([]),
      // salads: this.fb.array([]),
      // maincourses: this.fb.array([]),
      // dessert: this.fb.array([])
      // ... add more as needed
    });
  }

  ngOnInit(){
    this.fetchUserId();
    // this.fetchFoodInclusions();
    

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

  
  onSelectAppetizer(item: any) {
    const isAlreadySelected = this.selectedAppetizers.includes(item);

    // If the item is not in the array, add it; otherwise, remove it
    if (!isAlreadySelected) {
      this.selectedAppetizers.push(item);
    } else {
      this.selectedAppetizers = this.selectedAppetizers.filter(selectedItem => selectedItem !== item);
    }
  }

  onSelectSoup(item: any) {
    const isAlreadySelected = this.selectedSoups.includes(item);

    // If the item is not in the array, add it; otherwise, remove it
    if (!isAlreadySelected) {
      this.selectedSoups.push(item);
    } else {
      this.selectedSoups = this.selectedSoups.filter(selectedItem => selectedItem !== item);
    }
  }

  onSelectSalad(item: any) {
    const isAlreadySelected = this.selectedSalads.includes(item);

    // If the item is not in the array, add it; otherwise, remove it
    if (!isAlreadySelected) {
      this.selectedSalads.push(item);
    } else {
      this.selectedSalads = this.selectedSalads.filter(selectedItem => selectedItem !== item);
    }  }

  onSelectMainCourse(item: any) {
    const isAlreadySelected = this.selectedMainCourses.includes(item);

    // If the item is not in the array, add it; otherwise, remove it
    if (!isAlreadySelected) {
      this.selectedMainCourses.push(item);
    } else {
      this.selectedMainCourses = this.selectedMainCourses.filter(selectedItem => selectedItem !== item);
    }  }

  onSelectDessert(item: any) {
    const isAlreadySelected = this.selectedDesserts.includes(item);

    // If the item is not in the array, add it; otherwise, remove it
    if (!isAlreadySelected) {
      this.selectedDesserts.push(item);
    } else {
      this.selectedDesserts = this.selectedDesserts.filter(selectedItem => selectedItem !== item);
    }  
  }

  onSelectDrink(item: any) {
    const isAlreadySelected = this.selectedDrinks.includes(item);

    // If the item is not in the array, add it; otherwise, remove it
    if (!isAlreadySelected) {
      this.selectedDrinks.push(item);
    } else {
      this.selectedDrinks = this.selectedDrinks.filter(selectedItem => selectedItem !== item);
    }  
  }

  fetchFoodInclusions(){
    this.packageMenuService.getAppetizerItems(this.userId).subscribe(items =>
      {
        this.appetizerOptions = items.map(item => ({ ...item, selected: false }));
      });
    this.packageMenuService.getSoupItems(this.userId).subscribe(items =>
      {
        this.soupOptions = items.map(item => ({ ...item, selected: false }));
      });
    this.packageMenuService.getSaladItems(this.userId).subscribe(items =>
      {
        this.saladOptions = items.map(item => ({ ...item, selected: false }));
      });
    this.packageMenuService.getMainCourseItems(this.userId).subscribe(items =>
      {
        this.mainCourseOptions = items.map(item => ({ ...item, selected: false }));
      });
    this.packageMenuService.getDessertItems(this.userId).subscribe(items =>
      {
        this.dessertOptions = items.map(item => ({ ...item, selected: false }));
      });
    this.packageMenuService.getDrinkItems(this.userId).subscribe(items =>
      {
        this.drinkOptions = items.map(item => ({ ...item, selected: false }));
      });
    this.packageMenuService.getEventItems(this.userId).subscribe(eventName =>
      {
        this.eventOptions = eventName;
      });
      
  }

addPackage() {
  // Check if the form is valid before proceeding
  if (!this.packageMenuForm.valid) {
    alert('Please fill out all required fields correctly.');
    return;
  }

  // Create a copy of the form value to avoid modifying the original form data
  const packageData = { ...this.packageMenuForm.value };

  // Assuming `userId` is defined in your component
  const userId = this.userId;

  // Add selected food items to the packageData object
  packageData.selectedAppetizers = this.selectedAppetizers.map(item => item.food_name);
  packageData.selectedSoups = this.selectedSoups.map(item => item.food_name);
  packageData.selectedSalads = this.selectedSalads.map(item => item.food_name);
  packageData.selectedMainCourses = this.selectedMainCourses.map(item => item.food_name);
  packageData.selectedDesserts = this.selectedDesserts.map(item => item.food_name);
  packageData.selectedDrinks = this.selectedDrinks.map(item => item.food_name);
  // Add other selected items as needed

  // Call the service to add the package with the packageData and userId
  this.packageMenuService.addPackage(packageData, userId)
    .then(() => {
      // Reset the form and clear selected items after successful addition
      this.packageMenuForm.reset();
      this.clearSelectedItems();
    })
    .catch((error) => {
      // Handle errors here, such as displaying an alert or logging the error
      console.error('Error adding package:', error);
      alert('There was an error adding the package. Please try again later.');
    });
}

// Helper method to clear selected items
clearSelectedItems() {
  this.selectedAppetizers = [];
  this.selectedSoups = [];
  this.selectedSalads = [];
  this.selectedMainCourses = [];
  this.selectedDesserts = [];
  this.selectedDrinks = [];
  // Clear other selected items as needed
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

  // fetchPackages(){
  //   // Assuming you have a method in your service to get packages
  //   this.packageMenuService.getPackages(this.userId).subscribe((packages: any) => {
  //     // Map the retrieved packages to the structure expected by your template
  //     this.packages = packages.map(pkg => {
  //       return {
  //         packageName: pkg.packageName,
  //         typeEvent: pkg.typeEvent,
  //         numofPax: pkg.numofPax,
  //         appetizerFI: pkg.selectedAppetizers.join(', '), // Join appetizers into a string
  //         soupFI: pkg.selectedSoups.join(', '), // Join soups into a string
  //         saladFI: pkg.selectedSalads.join(', '), // Join salads into a string
  //         mainCourseFI: pkg.selectedMainCourses.join(', '), // Join main courses into a string
  //         dessertFI: pkg.selectedDesserts.join(', '), // Join desserts into a string
  //         // Add more fields as needed
  //       };
  //     });
  //     this.filteredPackages = this.packages;
  //   });
  // }

  sortPackages() {
    this.filteredPackages = [...this.packages]; // Create a copy
  
    this.filteredPackages.sort((a, b) => {
      if (this.sortingCriteria === 'numofPax') {
        // Convert numofPax to numbers for proper numeric sorting
        const aValue = parseFloat(a[this.sortingCriteria]);
        const bValue = parseFloat(b[this.sortingCriteria]);
  
        if (this.sortingDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else {
        // For other criteria, treat them as strings
        const aValue = a[this.sortingCriteria].toLowerCase();
        const bValue = b[this.sortingCriteria].toLowerCase();
  
        if (this.sortingDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
    });
  }
  


  onSortingCriteriaChange() {
    this.sortPackages();
  }


  onSortingDirectionChange() {
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
        // this.loadPackages();
  
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
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
    this.isUpdateMode = true;
    this.selectedPackageId = packages.id;
  
    // Set the form values
    this.packageMenuForm.setValue({
      packageName: packages.packageName,
      numofPax: packages.numofPax,
      typeEvent: packages.typeEvent,
      appetizerFI: packages.selectedAppetizers,
      soupFI: packages.selectedSoups,
      saladFI: packages.selectedSalads,
      mainCourseFI: packages.selectedMainCourses,
      dessertFI: packages.selectedDesserts

    });
  
    
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
        // this.fetchPackages();
        this.fetchFoodInclusions();
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

  logout() {
    this.authService.SignOutCaterer();
    // Redirect or handle post-logout logic here
  }
  
}
