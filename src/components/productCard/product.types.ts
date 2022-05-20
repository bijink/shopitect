export interface ProdDetailsProps {
   shopUrlName: string,
   // id: "CgSFEnzLpFNsGtQBHMom";
   // product: {
   prodName: string;
   prodBrand: string;
   prodCategory: string;
   prodImg: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   prodId: string;
   // };
};
interface ProdDetails {
   shopUrlName: string,
   // id: "CgSFEnzLpFNsGtQBHMom";
   // product: {
   name: string;
   brand: string;
   category: string;
   imageUrl: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   prodId: string;
   // };
};

export type ProdDetailsTypes = {
   id: string,
   data: () => ProdDetails;
};
