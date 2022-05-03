export interface ProdDetailsProps {
   // id: "CgSFEnzLpFNsGtQBHMom";
   // product: {
   prodName: string;
   prodCompany: string;
   prodCategory: string;
   prodImg: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   prodId: string;
   // };
};

export type ProdDetailsTypes = {
   id: string,
   data: () => ProdDetailsProps;
};
