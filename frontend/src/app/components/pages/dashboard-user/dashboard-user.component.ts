import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CateringService } from 'src/app/services/catering.service';
import { Catering } from 'src/app/shared/models/Catering';
import { FormsModule,FormControl, Validators,NgForm, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {

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
