// src/types/product.d.ts
export interface IProduct {
    _id: string;
    name: string;
    description?: string;
    price: number;
    image: string;
    category: string;
    stockRef?: {
      quantity: number;
    };
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  