import type { DocumentData, Timestamp } from "firebase/firestore";


export interface ProductTableProps {
   shopData: {
      address: string;
      providerID: string;
      accountID: string;
      category: string;
      email: string;
      name: string;
      ownerName: string;
      urlName: string;
      createdAt: Timestamp;
   } | DocumentData | null;
   products: DocumentData;
}

export interface ProductTableRowProps {
   rowBgColor: string;

   shopUrlName: string;

   prodId: string;
   prodNo: number;
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
   createdAt: Timestamp;
};

export type ProdDetailsTypes = {
   id: string;
   data: () => {
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
      imageUrl: string;
   };
};
