export interface ProdDetailsProps {
   prodName: string;
   prodCodeName: string;
   prodBrand: string;
   prodCategory: string;
   prodImg: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   profitAmount: number;
   profitPercentage: number;
   // createdAt: string;

   rowBgColor: string;
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
   // createdAt: string;
};

export type ProdDetailsTypes = {
   data: () => ProdDetails;
};
