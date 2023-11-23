import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-voucher-selection',
  templateUrl: './user-voucher-selection.component.html',
  styleUrls: ['./user-voucher-selection.component.css']
})
export class UserVoucherSelectionComponent {
  catererUid: string;
  voucherItems: Observable<any[]>;


constructor(
  private activatedRoute: ActivatedRoute,
  private firestore: AngularFirestore
) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.catererUid = params['catererUid'];
      this.loadVoucherItems(); // Fetch voucher data
    });
  }

  loadVoucherItems() {
    const collectionPath = `caterers/${this.catererUid}/voucherItems`; // Adjust the path accordingly
    this.voucherItems = this.firestore.collection(collectionPath).valueChanges();
  }

  vouchertoggleDescription(voucherItem: any): void {
    voucherItem.showFullDescription = !voucherItem.showFullDescription;
  }

}