import { Component, OnInit } from '@angular/core';
import { CateringService } from 'src/app/services/catering.service';
import { Tag } from 'src/app/shared/models/Tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  tags?:Tag[];
  constructor(cateringService:CateringService){
    this.tags = cateringService.getAllTags();
  }
  ngOnInit(): void {
  }
}
