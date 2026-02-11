import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET, AWS_REGION } from "../../config/s3.js";
import path from "path";

export const uploadToS3 = async (file, folder = "leaves") => {
  if (!file) return null;

  const ext = path.extname(file.originalname);
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ❌ ACL REMOVED — bucket owner enforced
  });

  await s3.send(command);

  // ✅ Public URL (bucket policy handles access)
  return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;
};
