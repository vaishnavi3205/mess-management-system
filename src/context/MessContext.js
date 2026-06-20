import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const MessContext = createContext();

export const MessProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [bills, setBills] = useState([]);
  const [staff, setStaff] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [faceDescriptors, setFaceDescriptors] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [menu, setMenu] = useState({
    breakfast: { items: [], vegetarian: true },
    lunch: { items: [], vegetarian: true },
    dinner: { items: [], vegetarian: true },
    special: { items: [], vegetarian: false },
  });

  // ── Only start Firestore listeners when user is authenticated ─────────────
  useEffect(() => {
    let unsubscribers = [];

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous listeners if any
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];

      if (!firebaseUser) {
        // User logged out — reset all state
        setStudents([]);
        setComplaints([]);
        setInventory([]);
        setBills([]);
        setStaff([]);
        setAnnouncements([]);
        setLeaves([]);
        setFaceDescriptors([]);
        setAttendanceRecords([]);
        setMenu({
          breakfast: { items: [], vegetarian: true },
          lunch: { items: [], vegetarian: true },
          dinner: { items: [], vegetarian: true },
          special: { items: [], vegetarian: false },
        });
        return;
      }

      // User is logged in — attach real-time listeners
      console.log("MessContext: user authenticated, attaching Firestore listeners");

      unsubscribers.push(
        onSnapshot(collection(db, "students"), (snap) => {
          setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("students listener error:", err))
      );

      unsubscribers.push(
        onSnapshot(collection(db, "complaints"), (snap) => {
          setComplaints(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("complaints listener error:", err))
      );

      unsubscribers.push(
        onSnapshot(collection(db, "inventory"), (snap) => {
          setInventory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("inventory listener error:", err))
      );

      unsubscribers.push(
        onSnapshot(collection(db, "bills"), (snap) => {
          setBills(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("bills listener error:", err))
      );

      unsubscribers.push(
        onSnapshot(collection(db, "staff"), (snap) => {
          setStaff(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("staff listener error:", err))
      );

      unsubscribers.push(
        onSnapshot(collection(db, "announcements"), (snap) => {
          setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("announcements listener error:", err))
      );

      unsubscribers.push(
        onSnapshot(collection(db, "leaves"), (snap) => {
          setLeaves(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("leaves listener error:", err))
      );

      unsubscribers.push(
        onSnapshot(collection(db, "faceDescriptors"), (snap) => {
          setFaceDescriptors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("faceDescriptors listener error:", err))
      );

      unsubscribers.push(
        onSnapshot(collection(db, "attendance"), (snap) => {
          setAttendanceRecords(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("attendance listener error:", err))
      );

      // Menu is a single document
      const fetchMenu = async () => {
        try {
          const docRef = doc(db, "menu", "current");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMenu(docSnap.data());
          }
        } catch (err) {
          console.error("menu fetch error:", err);
        }
      };
      fetchMenu();
    });

    return () => {
      unsubAuth();
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  // ── Menu ──────────────────────────────────────────────────────────────────
  const saveMenu = async (updatedMenu) => {
    setMenu(updatedMenu);
    await setDoc(doc(db, "menu", "current"), updatedMenu);
  };

  // ── Students ──────────────────────────────────────────────────────────────
  const addStudent = async (student) => {
    const { id, ...data } = student;
    await addDoc(collection(db, "students"), data);
  };

  const updateStudent = async (id, data) => {
    await updateDoc(doc(db, "students", id), data);
  };

  const deleteStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
  };

  // ── Staff ─────────────────────────────────────────────────────────────────
  const addStaff = async (member) => {
    const { id, ...data } = member;
    await addDoc(collection(db, "staff"), data);
  };

  const updateStaff = async (id, data) => {
    await updateDoc(doc(db, "staff", id), data);
  };

  const deleteStaff = async (id) => {
    await deleteDoc(doc(db, "staff", id));
  };

  // ── Complaints ────────────────────────────────────────────────────────────
  const addComplaint = async (complaint) => {
    const { id, ...data } = complaint;
    await addDoc(collection(db, "complaints"), data);
  };

  const updateComplaint = async (id, data) => {
    await updateDoc(doc(db, "complaints", id), data);
  };

  const deleteComplaint = async (id) => {
    await deleteDoc(doc(db, "complaints", id));
  };

  // ── Inventory ─────────────────────────────────────────────────────────────
  const addInventoryItem = async (item) => {
    const { id, ...data } = item;
    await addDoc(collection(db, "inventory"), data);
  };

  const updateInventoryItem = async (id, data) => {
    await updateDoc(doc(db, "inventory", id), data);
  };

  const deleteInventoryItem = async (id) => {
    await deleteDoc(doc(db, "inventory", id));
  };

  // ── Bills ─────────────────────────────────────────────────────────────────
  const addBill = async (bill) => {
    const { id, ...data } = bill;
    await addDoc(collection(db, "bills"), data);
  };

  const updateBill = async (id, data) => {
    await updateDoc(doc(db, "bills", id), data);
  };

  const deleteBill = async (id) => {
    await deleteDoc(doc(db, "bills", id));
  };

  // ── Announcements ─────────────────────────────────────────────────────────
  const addAnnouncement = async (announcement) => {
    const { id, ...data } = announcement;
    await addDoc(collection(db, "announcements"), data);
  };

  const deleteAnnouncement = async (id) => {
    await deleteDoc(doc(db, "announcements", id));
  };

  // ── Leaves ────────────────────────────────────────────────────────────────
  const addLeave = async (leave) => {
    const { id, ...data } = leave;
    await addDoc(collection(db, "leaves"), data);
  };

  const updateLeave = async (id, data) => {
    await updateDoc(doc(db, "leaves", id), data);
  };

  // ── Face Descriptors ──────────────────────────────────────────────────────
  const saveFaceDescriptor = async (email, name, descriptor) => {
    // Use email as doc ID so each student has one descriptor doc
    const safeId = email.replace(/[^a-zA-Z0-9]/g, "_");
    await setDoc(doc(db, "faceDescriptors", safeId), {
      email,
      name,
      descriptor: Array.from(descriptor),
    });
  };

  const deleteFaceDescriptor = async (email) => {
    const safeId = email.replace(/[^a-zA-Z0-9]/g, "_");
    await deleteDoc(doc(db, "faceDescriptors", safeId));
  };

  // ── Attendance ────────────────────────────────────────────────────────────
  const addAttendanceRecord = async (record) => {
    const { id, ...data } = record;
    await addDoc(collection(db, "attendance"), data);
  };

  return (
    <MessContext.Provider
      value={{
        students,
        complaints,
        inventory,
        bills,
        staff,
        announcements,
        leaves,
        faceDescriptors,
        attendance: attendanceRecords,
        menu,
        addStudent, updateStudent, deleteStudent,
        setStudents: () => {},
        addStaff, updateStaff, deleteStaff,
        addComplaint, updateComplaint, deleteComplaint,
        addInventoryItem, updateInventoryItem, deleteInventoryItem,
        addBill, updateBill, deleteBill,
        addAnnouncement, deleteAnnouncement,
        addLeave, updateLeave,
        saveFaceDescriptor, deleteFaceDescriptor,
        addAttendanceRecord,
        saveMenu,
      }}
    >
      {children}
    </MessContext.Provider>
  );
};

export const useMess = () => useContext(MessContext);
