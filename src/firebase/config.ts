import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCwCmmQIezufnoDIeOTqfFiRl0wVO02jvE",
  authDomain: "financesapp-1753f.firebaseapp.com",
  projectId: "financesapp-1753f",
  storageBucket: "financesapp-1753f.firebasestorage.app",
  messagingSenderId: "697202286528",
  appId: "1:697202286528:web:877a0f8870692dbf347225",
  measurementId: "G-0PPKVL2FJ2",
};

const app = initializeApp(firebaseConfig);

isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export const auth = getAuth(app);
export const db = getFirestore(app);

export const initFirestorePersistence = async () => {
  try {
    const { enableIndexedDbPersistence } = await import("firebase/firestore");
    await enableIndexedDbPersistence(db);
    console.log("Firestore persistence enabled");
  } catch (error) {
    console.warn("Failed to enable Firestore persistence:", error);
  }
};

export default app;

