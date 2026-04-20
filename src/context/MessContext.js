// import React, { createContext, useState } from "react";

// export const MessContext = createContext();

// export const MessProvider = ({ children }) => {
//   const [students, setStudents] = useState([]);
//   const [complaints, setComplaints] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [activities, setActivities] = useState([]);

//   // Add Student
//   const addStudent = (student) => {
//     setStudents([...students, student]);
//     setActivities([
//       { text: `New student added: ${student.name}`, time: new Date() },
//       ...activities,
//     ]);
//   };

//   // Add Complaint
//   const addComplaint = (complaint) => {
//     setComplaints([...complaints, complaint]);
//   };

//   // Add Inventory
//   const addInventory = (item) => {
//     setInventory([...inventory, item]);
//   };

//   return (
//     <MessContext.Provider
//       value={{
//         students,
//         complaints,
//         inventory,
//         activities,
//         addStudent,
//         addComplaint,
//         addInventory,
//       }}
//     >
//       {children}
//     </MessContext.Provider>
//   );
// };