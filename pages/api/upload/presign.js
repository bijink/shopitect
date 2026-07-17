import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "../../../config/cloudflare.config";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { key, contentType } = req.body; // e.g. key: "shop-name/product-images/abc.jpg"

  const putUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 3600 }
  );

  const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${key}`;

  res.status(200).json({ putUrl, publicUrl });
}
