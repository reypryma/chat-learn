import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWBdW1zlnNJL6ea_8BAGnCvIyIfhKnh2s",
  authDomain: "simple-chat-app-8ef9a.firebaseapp.com",
  databaseURL: "https://simple-chat-app-8ef9a.firebaseio.com",
  projectId: "simple-chat-app-8ef9a",
  storageBucket: "simple-chat-app-8ef9a.appspot.com",
  messagingSenderId: "465170183421",
  appId: "1:465170183421:web:f0f7eb3c2f72011ad27a94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth stuff
export const auth = firebase.auth();

const googleProvider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(googleProvider);
};

export const signOut = () => {
  auth.signOut();
};

// Firestore stuff
export const firestore = firebase.firestore();
window.firestore = firestore;

export const createOrGetUserProfileDocument = async (user, additionalData) => {
  if (!user) return;

  // check if a the user doc is there in DB with
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  // if no user exists in DB @ path 'userRef' then go and make one
  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user;

    const createdAt = new Date();

    try {
      await userRef.set({
        display_name: displayName || additionalData.displayName,
        email,
        photo_url: photoURL
          ? photoURL
          : 'https://ca.slack-edge.com/T0188513NTW-U01867WD8GK-ga631e27835b-72',
        created_at: createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user', error.message);
    }
  }
  return getUserDocument(user.uid);
};

export const getUserDocument = async (uid) => {
  if (!uid) return null;

  try {
    return await firestore.collection('users').doc(uid);
  } catch (error) {
    console.error('Error fetching user', error.message);
  }
};
