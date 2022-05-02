export interface ProdDetailsProps {
   prodName: string;
   companyName: string;
   prodCategory: string;
   prodImg: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   createdAt: string;
};

export type ProdDetailsTypes = {
   data: () => ProdDetailsProps;
};
