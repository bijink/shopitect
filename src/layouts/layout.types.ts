import { ReactNode } from "react";
import { DocumentData } from 'firebase/firestore';


type LayoutTypes = {
   children: ReactNode;
};

// export type PublicSectionLayoutTypes = LayoutTypes & {
//    shopDetails: {
//       address: string,
//       providerID: string,
//       accountID: string,
//       category: string,
//       email: string,
//       name: string,
//       ownerName: string,
//       urlName: string,
//       createdAt: {
//          nanoseconds: number,
//          seconds: number,
//       };
//    };
// };

export type PublicSectionLayoutTypes = LayoutTypes & DocumentData;
export type ShopAdminSectionLayoutTypes = LayoutTypes & DocumentData;
