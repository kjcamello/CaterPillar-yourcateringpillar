export class AppetizerItem {
  appetizer_name: string;
  appetizer_description: string;
  minimum_pax: number;
  pax_price: number;
  selected: boolean;
  appetizer_image: string;
  selectedPax: number; // Add a selectedPax property
  catererUid: string;
  appetizerItemId: string;
  isEditing: boolean = false;
  

  constructor() {
    this.appetizer_name = '';
    this.appetizer_description = '';
    this.minimum_pax = 0;
    this.pax_price = 0;
    this.selected = false;
    this.appetizer_image = '';
    this.selectedPax = 0; // Initialize the selectedPax property
    this.catererUid = ''; // Initialize the catererUid property
    this.appetizerItemId = ''; // Initialize the foodItemId property
  }
}
