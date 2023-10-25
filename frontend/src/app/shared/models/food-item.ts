export class FoodItem {
  food_name: string;
  food_description: string;
  minimum_pax: number;
  pax_price: number;
  selected: boolean;
  food_image: string;
  selectedPax: number; // Add a selectedPax property
  catererUid: string;
  foodItemId: string;
  

  constructor() {
    this.food_name = '';
    this.food_description = '';
    this.minimum_pax = 0;
    this.pax_price = 0;
    this.selected = false;
    this.food_image = '';
    this.selectedPax = 0; // Initialize the selectedPax property
    this.catererUid = ''; // Initialize the catererUid property
    this.foodItemId = ''; // Initialize the foodItemId property
  }
}
