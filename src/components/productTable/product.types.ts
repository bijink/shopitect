import { Timestamp } from "firebase/firestore";

export interface ProdDetailsProps {
   prodName: string;
   prodCodeName: string;
   prodBrand: string;
   prodCategory: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   profitAmount: number;
   profitPercentage: number;
   createdAt: Timestamp;
   // createdAt: Date;
   prodImg: string;

   rowBgColor: string;
   shopUrlName: string;
   prodId: string;
};
interface ProdDetails {
   name: string;
   codeName: string;
   brand: string;
   category: string;
   prodImg: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   profitAmount: number;
   profitPercentage: number;
   createdAt: Timestamp;
   // createdAt: Date;
   imageUrl: string;
};

export type ProdDetailsTypes = {
   id: string;
   data: () => ProdDetails;
};

export interface ProdDetailsModalTypes {
   prodName: string;
   prodCodeName: string;
   prodBrand: string;
   prodCategory: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   profitAmount: number;
   profitPercentage: number;

   shopUrlName: string;
   prodId: string;
};