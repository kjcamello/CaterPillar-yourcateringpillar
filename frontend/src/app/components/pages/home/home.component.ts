import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  catering:Catering[] = [];
  constructor(private cateringservice:CateringService, activatedRoute:ActivatedRoute){
    activatedRoute.params.subscribe((params) =>{
      if(params.searchTerm)
      this.catering = this.cateringservice.getAllCateringbySearchTerm(params.searchTerm);
      else if(params.tag)
      this.catering = this.cateringservice.getAllCateringByTag(params.tag);
      else
      this.catering = cateringservice.getAll();
    });
    
  }

  ngOnInit(): void {
  }

}
