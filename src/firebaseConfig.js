import { initializeApp } from "firebase/app";
import { getFirestore,collection } from "firebase/firestore";
// import { collection, addDoc, getDocs } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD09VSLeYgJh3oA5D3tqI_Ou0jwqtwKOg0",
  authDomain: "sm-assignment-lib.firebaseapp.com",
  projectId: "sm-assignment-lib",
  storageBucket: "sm-assignment-lib.appspot.com",
  messagingSenderId: "628027932594",
  appId: "1:628027932594:web:2bb15846b8616845f7aeab"
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

export const collectionRef = collection(database, 'courses');
export const userCollectionRef = collection(database, 'users');
export const topicUrlCollectionRef = collection(database, 'topicUrl');
export const downloadDocCollectionRef = collection(database, 'downloadDocInfo');
export const uploadDocCollectionRef = collection(database, 'uploadDocInfo');
export const storage = getStorage(app);