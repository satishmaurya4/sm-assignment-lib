// import { getDocs, query, where } from "firebase/firestore";
// import { downloadDocCollectionRef } from "../../firebaseConfig";
// export const getDownloadedAssignments = async () => {
//     // const roleQuery = query(collectionRef, where("role", "==", "student"));
//     const res = await getDocs(downloadDocCollectionRef)
//     const data = res.docs.map(item => {
//         return item.data();
//     })
//     return data;
// }