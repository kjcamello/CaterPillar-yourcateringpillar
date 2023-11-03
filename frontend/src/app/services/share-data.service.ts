import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {
  eventTypes: string[] = [];
  appetizers: string[] = [];
  soups: string[] = [];
  salads: string[] = [];
  mainCourses: string[] = [];
  desserts: string[] = [];
}
