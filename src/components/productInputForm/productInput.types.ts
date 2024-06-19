import { DocumentData, Timestamp } from "firebase/firestore";

export interface ProductInputProps {
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
}