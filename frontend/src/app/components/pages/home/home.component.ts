import { Component, OnInit } from '@angular/core';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  catering:Catering[] = [];
  constructor(private cateringservice:CateringService){
     this.catering = cateringservice.getAll();
  }

  ngOnInit(): void {
  }

}
