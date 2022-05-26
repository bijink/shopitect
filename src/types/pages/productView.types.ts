import type { Timestamp } from "firebase/firestore";

export interface ProductTypes {
   codeName: string;
   name: string;
   brand: string;
   category: string;
   imageUrl: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   profitAmount: number;
   profitPercentage: number;
   createdAt: Timestamp;
}