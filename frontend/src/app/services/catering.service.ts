import { Injectable } from '@angular/core';
import { sample_catering } from 'src/data';
import { Catering } from '../shared/models/Catering';

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
}
