import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceType } from 'src/app/models/service-type';
import { AuthService } from 'src/app/services/auth.service';
import { ServiceTypeService } from 'src/app/services/service-type.service';
// import { ServiceTypeService } from './service-type.service';

@Component({
  selector: 'app-add-service-type',
  templateUrl: './add-service-type.component.html',
  styleUrls: ['./add-service-type.component.css']
})
export class AddServiceTypeComponent implements OnInit {
  serviceTypeForm: FormGroup;
  serviceTypes: ServiceType[] = [];
  selectedServiceTypeId: string;

  constructor(
    private fb: FormBuilder,
    private serviceTypeService: ServiceTypeService,
    private authService: AuthService
  ) {
    this.serviceTypeForm = this.fb.group({
      eventType: ['', Validators.required],
      appetizer: ['', Validators.required],
      soup: ['', Validators.required],
      salad: ['', Validators.required],
      mainCourse: ['', Validators.required],
      dessert: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.serviceTypeService.getServiceTypes().subscribe(data => {
      this.serviceTypes = data;
    });
  }

  addServiceType() {
    if (this.serviceTypeForm.invalid) {
      alert('All fields are required');
      return;
    }

    const serviceType = this.serviceTypeForm.value;
    this.serviceTypeService.addServiceType(serviceType)
      .then(() => {
        console.log('Service Type Added');
        this.serviceTypeForm.reset();
        
      })
      .catch(error => {
        console.error('Error adding service type:', error);
        alert('Failed to add service type');
      });
  }

  updateServiceType(): void {
    this.serviceTypeService.updateServiceType(this.selectedServiceTypeId, this.serviceTypeForm.value).then(() => {
      alert('Service Type Updated!');
      this.resetForm();
    });
  }

  editServiceType(serviceType: ServiceType): void {
    this.selectedServiceTypeId = serviceType.id;
    this.serviceTypeForm.patchValue(serviceType);
  }

  deleteServiceType(serviceType: ServiceType): void {
    if (confirm('Are you sure you want to delete this service type?')) {
      this.serviceTypeService.deleteServiceType(serviceType.id).then(() => {
        alert('Service Type Deleted!');
      });
    }
  }

  getErrorMessage(field: string): string | null {
    const control = this.serviceTypeForm.get(field);
    if (control && control.touched && !control.value) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    return null;
  }
  

  resetForm(): void {
    this.serviceTypeForm.reset();
    this.selectedServiceTypeId = null;
  }

  logout() {
    this.authService.SignOutCaterer();
    // Redirect or handle post-logout logic here
  }
  
}
