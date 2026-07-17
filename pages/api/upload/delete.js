import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "../../../config/cloudflare.config";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: "key is required" });
  }

  if (!process.env.CLOUDFLARE_BUCKET_NAME) {
    return res.status(500).json({ error: "CLOUDFLARE_BUCKET_NAME is not set" });
  }

  await S3.send(
    new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
    })
  );

  res.status(200).json({ success: true });
}
