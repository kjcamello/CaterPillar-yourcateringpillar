import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface Caterer {
  id: string;
  catererDisplayName: string;
  catererEmail: string;
  status: string;
  reason: string;
}

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit {
  selectedTab: string = 'caterers'
  caterers: any[] = [];
  searchText: string = '';
  selectedSort: string = 'alphabetical';

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    // Fetch caterer data from Firestore
    this.firestore.collection('caterers').snapshotChanges().subscribe(caterers => {
      this.caterers = caterers.map(caterer => {
        const data = caterer.payload.doc.data() as Caterer; // Cast data to the Caterer interface
        return {
          id: caterer.payload.doc.id,
          catererDisplayName: data.catererDisplayName,
          catererEmail: data.catererEmail,
          status: data.status,
          reason: data.reason
        };
      });
    });
  }

  // Function to change the status and update the reason
  changeStatus(caterer: any): void {
    if (caterer.reason.trim() === '') {
      alert('Please provide a reason for the status change.');
    } else {
      // Update status in Firestore, e.g., using this.firestore.collection('caterers').doc(caterer.id).update({ status: caterer.status, reason: caterer.reason });
      alert(`Changed status of ${caterer.catererDisplayName} to ${caterer.status} - ${caterer.reason}`);
    }
  }
  selectTab(tab: string): void{
    this.selectedTab = tab;
  }

  // Sorting function
  sortCaterers(): void {
    if (this.selectedSort === 'alphabetical') {
      this.caterers.sort((a, b) => a.catererDisplayName.localeCompare(b.catererDisplayName));
    } else if (this.selectedSort === 'disabled') {
      this.caterers.sort((a, b) => a.status === 'Disabled' ? -1 : 1);
    } else if (this.selectedSort === 'warned') {
      this.caterers.sort((a, b) => a.status === 'Warning' ? -1 : 1);
    } else if (this.selectedSort === 'ordinary') {
      this.caterers.sort((a, b) => a.status === 'Ordinary' ? -1 : 1);
    }
  }
}
