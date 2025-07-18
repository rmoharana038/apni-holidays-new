import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore helpers
export const createUserProfile = async (uid: string, additionalData: any) => {
  if (!uid) return;
  
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    const { email, name } = additionalData;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        email,
        name,
        createdAt,
        isAdmin: false,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }
  
  return userRef;
};

export const getUserProfile = async (uid: string) => {
  if (!uid) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, updateData: any) => {
  if (!uid) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

// Package management
export const createPackage = async (packageData: any) => {
  try {
    // 1. Save to Firestore
    const packagesRef = collection(db, 'packages');
    const docRef = await addDoc(packagesRef, {
      ...packageData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 2. Also sync to backend DB
    await fetch('/api/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(packageData),
      credentials: 'include'
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

export const getPackages = async (filters?: any) => {
  try {
    const packagesRef = collection(db, 'packages');
    let q = query(packagesRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
    
    if (filters?.country) {
      q = query(q, where('country', '==', filters.country));
    }
    
    if (filters?.isInternational !== undefined) {
      q = query(q, where('isInternational', '==', filters.isInternational));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting packages:', error);
    return [];
  }
};

export const updatePackage = async (id: string, updateData: any) => {
  try {
    const packageRef = doc(db, 'packages', id);
    await updateDoc(packageRef, {
      ...updateData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
};

export const deletePackage = async (id: string) => {
  try {
    const packageRef = doc(db, 'packages', id);
    await deleteDoc(packageRef);
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};

export const uploadImage = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
