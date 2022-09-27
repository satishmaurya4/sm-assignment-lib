import { getDocs } from "firebase/firestore";
import { collectionRef } from "../firebaseConfig";

export const courseDocs = async () => {
  try {
    const res = await getDocs(collectionRef);

    const data = res.docs.map((item) => {
      return item.data();
    });
      return data;
  } catch (err) {
    console.log(err);
  }
};
