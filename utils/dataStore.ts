import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

const briefCollection = collection(db, 'briefs');

export const saveBriefData = async (slug: string, projectName: string, projectType: string, content: string, isPaidUser: boolean) => {
  try {
    // Create a sanitized version of the project name for use in the document ID
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    // Combine the slug and sanitized project name for the document ID
    const docId = `${slug}_${sanitizedProjectName}`;

    const briefRef = doc(db, 'briefs', docId);
    await setDoc(briefRef, {
      slug, // Store the original slug separately
      projectName,
      projectType,
      content,
      isPaidUser,
      createdAt: serverTimestamp(),
    });
    console.log('Brief data saved successfully with ID:', docId);
    return docId; // Return the new document ID
  } catch (error) {
    console.error('Error saving brief data:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

export const getBriefData = async (slug: string) => {
  try {
    // Query for the document that matches the slug
    const briefsRef = collection(db, 'briefs');
    const q = query(briefsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        projectName: data.projectName,
        projectType: data.projectType,
        content: data.content,
        isPaidUser: data.isPaidUser,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting brief data:', error);
    throw error;
  }
};