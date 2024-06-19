import type { Timestamp } from "firebase/firestore";

interface ProdDetails {
   shopUrlName: string,
   prodId: string;
   name: string;
   brand: string;
   category: string;
   imageUrl: string;
   quantity: number;
   sellPrice: number;
   createdAt: Timestamp;
};

export type ProdDetailsTypes = {
   id: string,
   data: () => ProdDetails;
};
