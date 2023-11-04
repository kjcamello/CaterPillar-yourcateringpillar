export class FoodItem {
  food_name: string;
  food_description: string;
  minimum_pax: number;
  pax_price: number;
  selected: boolean;
  food_image: string;
  selectedPax: number;
  catererUid: string;
  foodItemId: string;
  isEditing: boolean = false;
  category: string;

  constructor() {
    this.food_name = '';
    this.food_description = '';
    this.minimum_pax = 0;
    this.pax_price = 0;
    this.selected = false;
    this.food_image = '';
    this.selectedPax = 0;
    this.catererUid = '';
    this.foodItemId = '';
    this.category = '';
  }
}
