import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error("FIREBASE_STORAGE_BUCKET is not set");
}

const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "firebaseServiceAccount.json"), "utf8")
);

// ✅ CRITICAL: initialize ONCE
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// ✅ DO NOT pass bucket name again
export const bucket = admin.storage().bucket();
