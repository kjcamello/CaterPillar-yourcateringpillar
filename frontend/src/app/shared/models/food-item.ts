export class FoodItem {
  food_name: string;
  food_description: string;
  minimum_pax: number;
  pax_price: number;
  selected: boolean;
  food_image: string; // Add the 'food_image' property

  constructor() {
    this.food_name = '';
    this.food_description = '';
    this.minimum_pax = 0;
    this.pax_price = 0;
    this.selected = false; // Initialize the 'selected' property
    this.food_image = ''; // Initialize the 'food_image' property
  }
}
