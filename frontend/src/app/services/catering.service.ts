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
}
