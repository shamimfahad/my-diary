import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyDqLenk4yphCQxqP4WfdgiZyfYzGX9NMBU',
  authDomain: 'my-diary-6839a.firebaseapp.com',
  databaseURL: 'https://my-diary-6839a.firebaseio.com',
  projectId: 'my-diary-6839a',
  storageBucket: 'my-diary-6839a.appspot.com',
  messagingSenderId: '389531469972',
  appId: '1:389531469972:web:9542ec4c7e034ac9504c81',
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user', error);
    }
  }

  return userRef;
};

export const createEntry = async (entryData) => {
  const createdAt = new Date();
  try {
    firestore.collection('entries').add({
      ...entryData,
      createdAt,
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchEntries = async (email) => {
  const entriesSnapshot = firestore
    .collection('entries')
    .where('author', '==', email)
    .get();
  const transformedEntries = (await entriesSnapshot).docs.map((doc) => {
    const { body, createdAt, author, imageUrl } = doc.data();
    return {
      id: doc.id,
      body,
      author,
      createdAt,
      imageUrl,
    };
  });

  return transformedEntries;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;