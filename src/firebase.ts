// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk32Ss6MYYworq6LksK3-gtDzTtgUPrQI",
  authDomain: "docudoc-e4fd1.firebaseapp.com",
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
export async function submitConversationData(
  transcript: string,
  summary: string,
  postOperativeSteps: string
): Promise<void> {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      transcript: transcript,
      summary: summary,
      postOperativeSteps: postOperativeSteps,
      timestamp: Timestamp.now(),
    });
    console.log("Doc written ith ID: ", docRef.id);
  } catch (e){
    console.error("Error adding document: ", e);
  }
}


export {app, db}