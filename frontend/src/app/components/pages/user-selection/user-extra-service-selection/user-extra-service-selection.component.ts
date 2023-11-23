import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-extra-service-selection',
  templateUrl: './user-extra-service-selection.component.html',
  styleUrls: ['./user-extra-service-selection.component.css']
})
export class UserExtraServiceSelectionComponent {
  catererUid: string;
  extraServiceItems: Observable<any[]>;


constructor(
  private activatedRoute: ActivatedRoute,
  private firestore: AngularFirestore
) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.catererUid = params['catererUid'];
      this.loadExtraServiceItems(); // Fetch voucher data
    });
  }

  loadExtraServiceItems() {
    const collectionPath = `caterers/${this.catererUid}/extraserviceItems`; // Adjust the path accordingly
    this.extraServiceItems = this.firestore.collection(collectionPath).valueChanges();
  }

  vouchertoggleDescription(voucherItem: any): void {
    voucherItem.showFullDescription = !voucherItem.showFullDescription;
  }

}