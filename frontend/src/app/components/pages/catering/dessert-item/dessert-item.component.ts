import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dessert-item',
  templateUrl: './dessert-item.component.html',
  styleUrls: ['./dessert-item.component.css']
})
export class DessertItemComponent {
  @Input() dessert: any; // Use a more specific type for the dessert item, e.g., DessertItem

  constructor() {}

  // Add any category-specific logic, methods, and behavior here.
}
