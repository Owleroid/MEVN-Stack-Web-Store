interface CurrencyDetailsInput {
  amount: number;
  discount?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
}

export interface ProductInput {
  title: string;
  category: string;
  price: {
    rubles: CurrencyDetailsInput;
    euros: CurrencyDetailsInput;
  };
  artist: string;
  size: string;
  material: string;
  parts?: string;
  boxArt: string;
  description?: string;
  imageUrls?: {
    main: string;
    secondary: string[];
  };
}
