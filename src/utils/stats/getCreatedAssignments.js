import { getDocs, query, where } from "firebase/firestore";
import { topicUrlCollectionRef } from "../../firebaseConfig";
export const getCreatedAssignments = async () => {
    // const roleQuery = query(collectionRef, where("role", "==", "student"));
    const res = await getDocs(topicUrlCollectionRef)
    const data = res.docs.map(item => {
        return item.data();
    })
    return data;
}