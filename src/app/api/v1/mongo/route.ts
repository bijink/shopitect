import { db } from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const shop: string = searchParams.get("shop")!;

  const doc = await db.collection(shop).find({}).toArray();

  return Response.json(doc);
}

// export async function POST(req: Request) {
//   const body = await req.json();

//   let insertRes = await db.collection("user").insertOne(body);

//   const doc = await db.collection("user").find({ _id: insertRes.insertedId }).toArray();
//   return Response.json(doc);
// }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const searchParams = req.nextUrl.searchParams;

  const shop: string = searchParams.get("shop")!;
  // console.log(shop);

  let insertRes = await db.collection(shop).insertOne(body);

  const doc = await db.collection("user").find({ _id: insertRes.insertedId }).toArray();
  return Response.json(doc);
}
