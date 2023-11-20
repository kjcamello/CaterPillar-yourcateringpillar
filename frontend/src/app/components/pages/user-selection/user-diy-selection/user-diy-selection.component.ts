import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-diy-selection',
  templateUrl: './user-diy-selection.component.html',
  styleUrls: ['./user-diy-selection.component.css']
})
export class UserDiySelectionComponent implements OnInit {
  catererUid: string;
  mainCourseItems: Observable<any[]>;
  appetizerItems: Observable<any[]>;
  soupItems: Observable<any[]>;
  saladItems: Observable<any[]>;
  dessertItems: Observable<any[]>;
  drinkItems: Observable<any[]>;


  selectedItems: Observable<any[]>;
  selectedCategory: string;

    // Declare a variable to store the selected item
selectedItem: any;


extraServiceItems: Observable<any[]>;
eventItems: Observable<any[]>;
voucherItems: Observable<any[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.catererUid = params['catererUid'];
      // Provide a default category or choose one based on your use case
      this.loadFoodItems('maincourseItems');
      this.loadExtraServiceItems(); // Fetch extra service data
      this.loadEventItems(); // Fetch event data
      this.loadVoucherItems(); // Fetch voucher data
    });
  }

  loadFoodItems(category: string) {
    this.selectedCategory = category;

    // Construct the correct collection path based on the category
    const collectionPath = `caterers/${this.catererUid}/${category}`;

    this.selectedItems = this.firestore
      .collection(collectionPath)
      .valueChanges();
  }

  loadExtraServiceItems() {
    const collectionPath = `caterers/${this.catererUid}/extraserviceItems`; // Adjust the path accordingly
    this.extraServiceItems = this.firestore.collection(collectionPath).valueChanges();
  }

  loadEventItems() {
    const collectionPath = `caterers/${this.catererUid}/eventItems`; // Adjust the path accordingly
    this.eventItems = this.firestore.collection(collectionPath).valueChanges();
  }

  loadVoucherItems() {
    const collectionPath = `caterers/${this.catererUid}/voucherItems`; // Adjust the path accordingly
    this.voucherItems = this.firestore.collection(collectionPath).valueChanges();
  }

  foodtoggleDescription(item: any): void {
    item.showFullDescription = !item.showFullDescription;
  }

  estoggleDescription(extraService: any): void {
    extraService.showFullDescription = !extraService.showFullDescription;
  }

  eventtoggleDescription(eventItem: any): void {
    eventItem.showFullDescription = !eventItem.showFullDescription;
  }

  vouchertoggleDescription(voucherItem: any): void {
    voucherItem.showFullDescription = !voucherItem.showFullDescription;
  }
}