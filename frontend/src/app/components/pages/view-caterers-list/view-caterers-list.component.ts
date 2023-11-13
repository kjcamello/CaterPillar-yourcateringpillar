import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FoodItem } from 'src/app/shared/models/food-item';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-caterers-list',
  templateUrl: './view-caterers-list.component.html',
  styleUrls: ['./view-caterers-list.component.css']
})
export class ViewCaterersListComponent implements OnInit {
    caterers: Observable<any[]>; // Use the appropriate data type for your caterer documents

  catering: Catering[] = [];
  foodItems: Observable<FoodItem[]>; // Updated data type

  constructor(
    private cateringservice: CateringService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore, // Angular Firestore injection
    private router: Router
  ) {
    // Your existing code to fetch catering data
    this.activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        this.catering = this.cateringservice.getAllCateringbySearchTerm(params.searchTerm);
      } else if (params.tag) {
        this.catering = this.cateringservice.getAllCateringByTag(params.tag);
      } else {
        this.catering = cateringservice.getAll();
      }
    });
  }

  ngOnInit(): void {
    this.caterers = this.firestore.collection('caterers').valueChanges();
  }
}