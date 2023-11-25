import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventSelectionService } from 'src/app/services/event-selection.service';

// Create an interface for the extra service
interface ExtraService {
  esMinHours: number;
  esMaxHours: number;
  // Add other properties as needed
}

@Component({
  selector: 'app-user-extra-service-selection',
  templateUrl: './user-extra-service-selection.component.html',
  styleUrls: ['./user-extra-service-selection.component.css']
})
export class UserExtraServiceSelectionComponent implements OnInit {
  catererUid: string;
  extraServiceItems: Observable<any[]>;
  selectedExtraServices$: Observable<any[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private eventSelectionService: EventSelectionService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.catererUid = params['catererUid'];
      this.loadExtraServiceItems(); // Fetch extra service data
    });

    // Use the async pipe to bind the observable directly in the template
    this.selectedExtraServices$ = this.eventSelectionService.selectedExtraServices$;
  }

  toggleExtraServiceSelection(esItem: any): void {
    // Toggle the selected property of the clicked extra service
    esItem.selected = !esItem.selected;
  
    // Update the selected extra services based on the selection/deselection
    const selectedExtraServices = this.eventSelectionService.getSelectedExtraServices();
  
    if (esItem.selected) {
      selectedExtraServices.push(esItem);
    } else {
      const index = selectedExtraServices.findIndex(service => service.id === esItem.id);
      if (index !== -1) {
        selectedExtraServices.splice(index, 1);
      }
    }
  
    // Update the service with the new selected extra services
    this.eventSelectionService.setSelectedExtraServices([...selectedExtraServices]);
  }
  
  loadExtraServiceItems() {
    const collectionPath = `caterers/${this.catererUid}/extraserviceItems`;
    this.extraServiceItems = this.firestore.collection(collectionPath).valueChanges()
      .pipe(
        map((extraServices: ExtraService[]) => {
          // Initialize selectedHours for each extra service item
          return extraServices.map(extraService => ({
            ...extraService,
            selectedHours: extraService.esMinHours, // Set initial value to esMinHours
          }));
        })
      );
  }

  estoggleDescription(extraService: any): void {
    extraService.showFullDescription = !extraService.showFullDescription;
  }

  checkAndAdjustHours(extraService: any): void {
    const newValue = parseInt(extraService.selectedHours, 10);

    if (newValue < extraService.esMinHours || newValue > extraService.esMaxHours) {
      extraService.selectedHoursError = `Selected hours should be between ${extraService.esMinHours} and ${extraService.esMaxHours}.`;
      alert(extraService.selectedHoursError);
      extraService.selectedHours = extraService.esMinHours + 1;
    } else {
      extraService.selectedHoursError = null;
    }
  }
}
