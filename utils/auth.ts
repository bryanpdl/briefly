import { auth, googleProvider, db } from './firebaseConfig';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await createUserDocument(user);
    return user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    return null;
  }
};

export const signOut = () => auth.signOut();

const createUserDocument = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        subscribed: 'no', // Default to 'no' for new users
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
};

export const checkUserSubscription = async (userId: string): Promise<boolean> => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    const userData = snapshot.data();
    return userData.subscribed === 'yes';
  }
  return false;
};

export const signInWithEmailPassword = async (email: string, password: string): Promise<User | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email/password", error);
    return null;
  }
};

export const createUserWithEmailPassword = async (email: string, password: string): Promise<User | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await createUserDocument(user);
    return user;
  } catch (error) {
    console.error("Error creating user with email/password", error);
    return null;
  }
};