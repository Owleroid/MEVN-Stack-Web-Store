export interface ProductInput {
  title: string;
  category: string;
  price: number;
  artist: string;
  size: string;
  material: string;
  parts?: string;
  boxArt: string;
  amount: number;
  description?: string;
  imageUrls?: {
    main: string;
    secondary: string[];
  };
}

export interface Product extends ProductInput {
  _id: string;
}
