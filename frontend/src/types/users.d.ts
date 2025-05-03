export interface DeliveryData {
  country?: string;
  city?: string;
  street?: string;
  buildingNumber?: string;
  apartment?: string;
  postalCode?: string;
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  registrationDate: string;
  isAdmin?: boolean;
  deliveryData?: DeliveryData;
}
