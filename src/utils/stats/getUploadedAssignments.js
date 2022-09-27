import { getDocs, query, where } from "firebase/firestore";
import { uploadDocCollectionRef } from "../../firebaseConfig";
export const getUploadedAssignments = async () => {
    // const roleQuery = query(collectionRef, where("role", "==", "student"));
    const res = await getDocs(uploadDocCollectionRef)
    const data = res.docs.map(item => {
        return item.data();
    })
    return data;
}