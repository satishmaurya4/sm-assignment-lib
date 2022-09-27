import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// import { collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

console.log("firebase", process.env.API_KEY);

const API_KEY = process.env.REACT_APP_API_KEY;
const AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN;
const PROJECT_ID = process.env.REACT_APP_PROJECT_ID;
const STORAGE_BUCKET = process.env.REACT_APP_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = process.env.REACT_APP_MESSAGING_SENDER_ID;
const APP_ID = process.env.REACT_APP_APP_ID;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

export const collectionRef = collection(database, "courses");
export const userCollectionRef = collection(database, "users");
export const topicUrlCollectionRef = collection(database, "topicUrl");
export const downloadDocCollectionRef = collection(database, "downloadDocInfo");
export const uploadDocCollectionRef = collection(database, "uploadDocInfo");
export const storage = getStorage(app);
