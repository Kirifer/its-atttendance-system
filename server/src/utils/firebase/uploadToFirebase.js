import { bucket } from "../../config/firebase.js";
import path from "path";

export const uploadToFirebase = async (file, folder = "leaves") => {
  const ext = path.extname(file.originalname);
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;

  const firebaseFile = bucket.file(fileName);

  await firebaseFile.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  });

  await firebaseFile.makePublic(); 

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
};
