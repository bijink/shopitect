import { ReactNode } from "react";
import { DocumentData } from 'firebase/firestore';


type LayoutTypes = {
   children: ReactNode;
};

// export type PublicSectionLayoutTypes = LayoutTypes & {
//    shopDetails: {
//       shopAddress: string,
//       shopAuthId: string,
//       shopCategory: string,
//       shopEmail: string,
//       shopName: string,
//       shopOwnerName: string,
//       shopUrlName: string,
//       createdAt: {
//          nanoseconds: number,
//          seconds: number,
//       };
//    };
// };

export type PublicSectionLayoutTypes = LayoutTypes & DocumentData;
export type ShopAdminSectionLayoutTypes = LayoutTypes & DocumentData;
