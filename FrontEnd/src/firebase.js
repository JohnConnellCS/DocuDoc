// Import the functions you need from the SDKs you need
import { initializeApp  } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: "docudoc-e4fd1",
  storageBucket: "docudoc-e4fd1.firebasestorage.app",
  messagingSenderId: "722087045855",
  appId: "1:722087045855:web:6d079dd1319369c486976a",
  measurementId: "G-CMNW7BNLYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//  Function to submit conversation data
async function submitConversationData(
  rawData,
  transcriptSummary,
  postOpSummary
) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      transcript: rawData,
      summary: transcriptSummary,
      postOperativeSteps: postOpSummary,
      timestamp: Timestamp.now(),
    });
    console.log("Doc written ith ID: ", docRef.id);
  } catch (e){
    console.error("Error adding document: ", e);
  }
}

async function getAllUsersData() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const allUsersData = [];
    querySnapshot.forEach((doc) => {
      allUsersData.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return allUsersData;
  } catch (e) {
    console.error("Error fetching users data: ", e);
  }
}


module.exports = { app, db, submitConversationData, getAllUsersData};