import "server-only";
import { S3Client } from "@aws-sdk/client-s3";
export const documentBucket = "student-documents";
export function storage() {
  return new S3Client({
    forcePathStyle: true,
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
}
