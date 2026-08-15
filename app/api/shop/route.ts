import { database } from "@/config/firebase.config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shopName = searchParams.get("name");
  const accountId = searchParams.get("id");

  if (shopName) {
    const docRef = doc(database, "shops", shopName);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return Response.json({ data: null });
    return Response.json({ data: docSnap.data() });
  } else {
    let data = null;
    const q = query(
      collection(database, "shops"),
      where("accountID", "==", accountId),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data = doc.data();
    });
    return Response.json({ data });
  }
}
