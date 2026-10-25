// src/context/AdminAuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setUser(firebaseUser);
      try {
        const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
        setIsAdmin(adminDoc.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const adminDoc = await getDoc(doc(db, "admins", cred.user.uid));
    if (!adminDoc.exists()) {
      await firebaseSignOut(auth);
      throw new Error("This account doesn't have admin access.");
    }
    return cred.user;
  }

  async function logout() {
    await firebaseSignOut(auth);
  }

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
