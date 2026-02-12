import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.AWS_REGION ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_BUCKET_NAME
) {
  throw new Error("AWS S3 environment variables are not set properly");
}

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const S3_BUCKET = process.env.AWS_BUCKET_NAME;
export const AWS_REGION = process.env.AWS_REGION;
