import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";

// interface dataType {
//    shopAddress: '',
//    shopGoogleAuthId: '',
//    shopCategory: '',
//    shopEmail: '',
//    shopName: '',
//    shopOwnerName: '',
//    shopUrlName: '',
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
      onSnapshot(query(collection(database, 'shops'), where('shopUrlName', '==', shopAppId)), (snapshot) => {
         snapshot.forEach(obj => {
            resolve(obj.data());
         });
      });
   });
}
