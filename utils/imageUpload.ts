import { storage, auth } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to upload images');
    }

    console.log('Uploading file:', file.name);
    const storageRef = ref(storage, `references/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully:', snapshot);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};