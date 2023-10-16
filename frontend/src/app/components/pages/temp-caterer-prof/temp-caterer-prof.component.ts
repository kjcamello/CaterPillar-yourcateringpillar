import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-temp-caterer-prof',
  templateUrl: './temp-caterer-prof.component.html',
  styleUrls: ['./temp-caterer-prof.component.css']
})
export class TempCatererProfComponent implements OnInit {
  catererId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Retrieve the catererId from the route parameters
    this.route.params.subscribe(params => {
      this.catererId = params['catererId'];

      // Now you can use this catererId to fetch the caterer's profile
      // You can make an API call or fetch data from your service using this ID.
      // For this temporary component, you can display static data or mock data.
    });
  }
}
