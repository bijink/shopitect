import { Timestamp } from "firebase/firestore";

export interface ShopData {
   address: string;
   providerID: string;
   accountID: string;
   category: string;
   email: string;
   name: string;
   ownerName: string;
   about: string;
   urlName: string;
   createdAt: Timestamp;
   logoUrl: string;
}
