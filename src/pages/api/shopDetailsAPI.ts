import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";

// interface dataType {
//    address: '',
//    providerID: '',
//    accountID: '',
//    category: '',
//    email: '',
//    name: '',
//    ownerName: '',
//    urlName: '',
//    createdAt: {
//       nanoseconds: 0,
//       seconds: 0,
//    },
// },

export function fetchShopDetails(shopAppId: string | string[] | undefined) {
   // return new Promise<{ data: number; }>((resolve) =>
   //    setTimeout(() => resolve({ data: amount }), 500)
   // );
   // return new Promise<{ data: dataType }>((resolve) => {
   return new Promise((resolve) => {
      onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppId)), (snapshot) => {
         snapshot.forEach(obj => {
            resolve(obj.data());
         });
      });
   });
}
