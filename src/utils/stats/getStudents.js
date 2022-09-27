import { getDocs, query, where } from "firebase/firestore";
import { userCollectionRef } from "../../firebaseConfig";
export const getStudents = async () => {
    const roleQuery = query(userCollectionRef, where("role", "==", "student"));
    const res = await getDocs(roleQuery)
    const data = res.docs.map(item => {
        return item.data();
    })
    return data;
}