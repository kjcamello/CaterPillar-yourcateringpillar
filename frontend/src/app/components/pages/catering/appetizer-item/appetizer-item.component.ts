import { Injectable, NgZone } from '@angular/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppetizerItem } from 'src/app/shared/models/appetizer-item';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-appetizer-item',
  templateUrl: './appetizer-item.component.html',
  styleUrls: ['./appetizer-item.component.css']
})
export class AppetizerItemComponent {
  @Input() appetizerItem: AppetizerItem;
  @Input() isEditMode: boolean; // Control the edit mode
  @Output() saveAppetizer: EventEmitter<AppetizerItem> = new EventEmitter<AppetizerItem>();
  appetizerItems: AppetizerItem[] = [];

  errorMessage: string = null;

  editMode: boolean = false; // Property to control edit mode
  editingAppetizerItem: AppetizerItem = new AppetizerItem(); // Placeholder for the food item being edited

  constructor(private authService: AuthService, private afs: AngularFirestore) {}

  uploadAppetizerImage(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const selectedFile = files[0];
  
      // Check the file's MIME type
      if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg' || selectedFile.type === 'image/png') {
        this.appetizerItem.appetizer_image = selectedFile;
  
        // Set the image preview
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.appetizerItem.appetizer_image = e.target.result; // Set the base64 data URL to the food_item's image property
        };
  
        reader.readAsDataURL(selectedFile);
      } else {
        this.errorMessage = 'File not uploaded. It must be a .jpg, .jpeg, or .png file.';
        alert(this.errorMessage);
  
        // Clear the file input so it's not saved
        event.target.value = '';
        this.appetizerItem.appetizer_image = null; // Clear the preview
      }
    }
  }

  saveAppetizerItem() {
    this.errorMessage = this.validateFields(this.appetizerItem);
  
    if (!this.errorMessage) {
      this.saveAppetizer.emit(this.appetizerItem); // Emit the event to the parent component
      this.isEditMode = false; // Exit edit mode
    } else {
      alert(this.errorMessage);
    }
  }

  updateAppetizerItem() {
    const appetizerItemToUpdate = { ...this.editingAppetizerItem };
    // Perform validation here if needed

    // Call a service method to update the food item in Firestore using the existing foodItem ID
    this.authService.updateAppetizerItem(appetizerItemToUpdate)
      .then(() => {
        // Update the local foodItems array with the updated item
        const index = this.appetizerItems.findIndex(item => item.appetizerItemId === appetizerItemToUpdate.appetizerItemId);
        if (index !== -1) {
          this.appetizerItems[index] = { ...appetizerItemToUpdate };
        }

        this.editingAppetizerItem = new AppetizerItem();
        this.editMode = false;
        alert('Appetizer item updated successfully.');
      })
      .catch(error => {
        alert('Error updating appetizer item: ' + error);
      });
  }

/*
  // Add an update method to allow editing
  update
  
  Item() {
    this.isEditMode = true;
  }*/

  private validateFields(appetizerItem: AppetizerItem): string | null {
    if (!this.appetizerItem.appetizer_name || !this.appetizerItem.appetizer_description || !this.appetizerItem.minimum_pax || !this.appetizerItem.pax_price) {
      return 'Please fill in all fields.';
    }

    if (this.appetizerItem.minimum_pax <= 4) {
      return 'Minimum Pax value must be greater than 4.';
    }

    return null;
  }

  toggleAppetizerEditMode() { //appetizer
    this.isEditMode = !this.isEditMode;

    if (!this.isEditMode) {
      // Clear the error message and reset the form
      this.errorMessage = null;
      this.editingAppetizerItem = new AppetizerItem();

    }
  }

}
