import { Timestamp } from "firebase/firestore";

export interface ProdDetailsProps {
   shopUrlName: string,
   prodName: string;
   prodBrand: string;
   prodCategory: string;
   prodImg: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   prodId: string;
   createdAt: Timestamp;
};
interface ProdDetails {
   shopUrlName: string,
   name: string;
   brand: string;
   category: string;
   imageUrl: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   prodId: string;
   createdAt: Timestamp;
};

export type ProdDetailsTypes = {
   id: string,
   data: () => ProdDetails;
};
