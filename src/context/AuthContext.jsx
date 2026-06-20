import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (docSnap.exists()) {
            setUser({
              email: firebaseUser.email,
              role: docSnap.data().role,
              uid: firebaseUser.uid,
            });
          } else {
            // Firestore doc not ready yet — set basic user so ProtectedRoute doesn't kick out
            setUser({ email: firebaseUser.email, uid: firebaseUser.uid, role: null });
          }
        } catch {
          setUser({ email: firebaseUser.email, uid: firebaseUser.uid, role: null });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  // Signs in with Firebase, verifies role, then sets user immediately
  // so navigation works on first attempt.
  const login = async (userData) => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        userData.email.toLowerCase().trim(),
        userData.password
      );

      const docSnap = await getDoc(doc(db, "users", credential.user.uid));

      if (docSnap.exists() && docSnap.data().role === userData.role) {
        // Set user immediately — don't wait for onAuthStateChanged
        setUser({
          email: credential.user.email,
          role: docSnap.data().role,
          uid: credential.user.uid,
        });
        return true;
      } else {
        // Role mismatch
        await signOut(auth);
        setUser(null);
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  // ── Signup ────────────────────────────────────────────────────────────────
  const signup = async (userData) => {
    const email = userData.email.toLowerCase().trim();

    try {
      // If student, verify owner has pre-registered this email
      if (userData.role === "student") {
        const studentsSnap = await getDocs(
          query(collection(db, "students"), where("email", "==", email))
        );
        if (studentsSnap.empty) {
          return {
            success: false,
            message:
              "Your email is not registered by the mess owner. Please contact the owner first.",
          };
        }
      }

      // Create Firebase Auth account
      const credential = await createUserWithEmailAndPassword(auth, email, userData.password);
      const uid = credential.user.uid;

      // Save role in users collection
      await setDoc(doc(db, "users", uid), {
        email,
        role: userData.role,
        createdAt: new Date().toISOString(),
      });

      // If student, move their pre-registered doc to students/{uid}
      if (userData.role === "student") {
        const studentsSnap = await getDocs(
          query(collection(db, "students"), where("email", "==", email))
        );
        if (!studentsSnap.empty) {
          const oldDoc = studentsSnap.docs[0];
          if (oldDoc.id !== uid) {
            await setDoc(doc(db, "students", uid), { ...oldDoc.data(), uid });
            await deleteDoc(doc(db, "students", oldDoc.id));
          } else {
            await updateDoc(doc(db, "students", uid), { uid });
          }
        }
      }

      return { success: true };
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        return { success: false, message: "An account with this email already exists." };
      }
      return { success: false, message: error.message };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
