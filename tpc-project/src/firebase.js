// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCablWOyFMHRItiZiB8tyhM-woGgYqEvZ0",
  authDomain: "tpc-project-30992.firebaseapp.com",
  projectId: "tpc-project-30992",
  storageBucket: "tpc-project-30992.appspot.com",
  messagingSenderId: "241794099534",
  appId: "1:241794099534:web:5077ed464e67414700961f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app)
// Export both app and storage
export { app, storage,auth };
