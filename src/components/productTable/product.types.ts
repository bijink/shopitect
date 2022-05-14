export interface ProdDetailsProps {
   prodName: string;
   prodBrand: string;
   prodCategory: string;
   prodImg: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   // createdAt: string;
};
interface ProdDetails {
   name: string;
   brand: string;
   category: string;
   prodImg: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   // createdAt: string;
};

export type ProdDetailsTypes = {
   data: () => ProdDetails;
};
