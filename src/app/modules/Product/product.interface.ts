import { Size } from "@prisma/client";

export interface IProduct {
    name: string;
    price: string; 
    stock: string; 
    categoryId: string; 
    shopId: string; 
    sizes: Size[]; 
    images: string[]; 
    discounts: string;
    description: string;
  }
  
  export interface IUpdateProduct {
    name: string;
    price: number; 
    stock: number; 
    sizes: Size[]; 
    images: string[]; 
    discounts: number;
    description: string;
  }