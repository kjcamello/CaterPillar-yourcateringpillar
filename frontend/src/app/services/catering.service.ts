import { Injectable } from '@angular/core';
import { sample_catering, sample_tags } from 'src/data';
import { Catering } from '../shared/models/Catering';
import { Tag } from '../shared/models/Tag';

@Injectable({
  providedIn: 'root'
})
export class CateringService {

  constructor() { }

  getAll():Catering[]{
    return sample_catering;
  }

  getAllCateringbySearchTerm(searchTerm:string){
    return this.getAll().filter(Catering => Catering.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  getAllTags():Tag[]{
    return sample_tags;
  }

  getAllCateringByTag(tag:string):Catering[]{
    return tag == "All"?
    this.getAll():
    this.getAll().filter(Catering => Catering.tags?.includes(tag));

  }
}
