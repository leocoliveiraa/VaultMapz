import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/config";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  async register(email: string, password: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async loginWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },
};
