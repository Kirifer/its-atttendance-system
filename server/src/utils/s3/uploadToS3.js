import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
  });

  await s3.send(command);

  return fileName;
};

export const getPresignedUrl = async (fileKey, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileKey,
  });

  return await getSignedUrl(s3, command, { expiresIn });
};