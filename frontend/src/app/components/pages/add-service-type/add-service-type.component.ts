import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
  userId: string;

  constructor(
    private fb: FormBuilder,
    private serviceTypeService: ServiceTypeService,
    private authService: AuthService,
    private afAuth: AngularFireAuth
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
    this.loadServiceType();
    this.fetchUserId();
  }

  fetchUserId() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadServiceType();
      }
    });
  }


  loadServiceType(){
    this.serviceTypeService.getServiceTypes(this.userId).subscribe(data => {
      this.serviceTypes = data.map(a =>{
        return{
          id: a.payload.doc.id,
          ...a.payload.doc.data() as ServiceType
        };
      });
    });
  }

  addServiceType() {
    if (this.serviceTypeForm.invalid) {
      alert('All fields are required');
      return;
    }

    const serviceType = this.serviceTypeForm.value;
    this.serviceTypeService.addServiceType(serviceType, this.userId)
      .then(() => {
        console.log('Service Type Added');
        this.serviceTypeForm.reset();
        
      })
      .catch(error => {
        console.error('Error adding service type:', error);
        alert('Failed to add service type');
      });
  }

  updateServiceType(){

    const updatedServiceType = this.serviceTypeForm.value;
    this.serviceTypeService.updateServiceType(this.selectedServiceTypeId, updatedServiceType, this.userId).then(() => {
      alert('Service Type Updated!');
      this.resetForm();
    });
  }

  editServiceType(serviceType: any){
    this.selectedServiceTypeId = serviceType.id;
    this.serviceTypeForm.patchValue(serviceType);
  }

  deleteServiceType(id){
    if (confirm('Are you sure you want to delete this service type?')) {
      this.serviceTypeService.deleteServiceType(id, this.userId).then(() => {
        this.loadServiceType();
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
