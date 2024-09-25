import { db } from './firebaseConfig';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const briefCollection = collection(db, 'briefs');

export const saveBriefData = async (slug: string, projectName: string, brief: string) => {
  const briefDoc = doc(briefCollection, slug);
  await setDoc(briefDoc, { projectName, content: brief });
};

export const getBriefData = async (slug: string): Promise<{ projectName: string; content: string } | null> => {
  try {
    const briefDoc = doc(briefCollection, slug);
    const docSnap = await getDoc(briefDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { projectName: data.projectName, content: data.content };
    } else {
      console.log(`No document found for slug: ${slug}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching brief data:', error);
    return null;
  }
};