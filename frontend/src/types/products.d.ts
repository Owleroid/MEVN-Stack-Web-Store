export interface Product {
  _id: string;
  name: string;
  slug: string;
  productNumber: string;
  category: string;
  price: {
    rubles: number;
    euros: number;
  };
  artist?: string;
  size: string;
  material: string;
  parts?: string;
  boxArt: string;
  description?: string;
  imageUrls: {
    main: string;
    secondary?: string[];
  };
  discount?: {
    originalPrice: {
      rubles: number;
      euros: number;
    };
    discountAmount: {
      rubles: number;
      euros: number;
    };
    discountName: string;
    discountId: string;
    endsAt: Date;
  };
}

export interface ProductInput {
  name: string;
  category: string;
  slug?: string;
  productNumber: string;
  price: {
    rubles: number;
    euros: number;
  };
  artist?: string;
  size: string;
  material: string;
  parts?: string;
  boxArt: string;
  description?: string;
  imageUrls: {
    main: string;
    secondary?: string[];
  };
}

export interface ProductListResponse {
  success: boolean;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  product: Product;
  correctCategorySlug?: string;
  redirectNeeded?: boolean;
}

export interface ProductIdsResponse {
  success: boolean;
  productIds: string[];
}

export interface ProductActionResponse {
  success: boolean;
  productId?: string;
  category?: string;
}
