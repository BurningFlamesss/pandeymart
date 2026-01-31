export interface Product {
  id: string;
  name: {
    english: string;
    nepali: string;
  };
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  location: string;
  sellerContact: string;
  createdAt: string;
  expectedLifeSpan: number;
}

export interface UIProduct {
  productId: string;
  productName: string;
  description: string;
  productImage: string;
  price: string;
  quantity: string;
  createdAt: string;
  expectedLifeSpan: string;
}

export interface IndividualProduct {
  productId: string;
  productName: string;
  description: string;
  productImage: string;
  price: string;
  quantity: string;
  createdAt: string;
  expectedLifeSpan: string;
  seller: {
    farmerID: string;
    verified: boolean;
    username: string;
    contact: string;
    gmail: string;
    address: string;
  };
}