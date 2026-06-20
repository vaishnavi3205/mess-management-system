import { BrowserRouter, Routes, Route } from "react-router-dom";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import MenuManagement from "../pages/owner/MenuManagement";
import ManageStudents from "../pages/owner/ManageStudents";
import InventoryManagement from "../pages/owner/InventoryManagement";
import BillingRevenue from "../pages/owner/BillingRevenue";
import Complaints from "../pages/owner/Complaints";
import Announcements from "../pages/owner/Announcements";
import WasteManagement from "../pages/owner/WasteManagement";
import StaffManagement from "../pages/owner/StaffManagement";
import LeaveRequests from "../pages/owner/LeaveRequests";
import Attendance from "../pages/owner/Attendance";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Student Route */}
        <Route element={<ProtectedRoute requiredRole="student" />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>
        
        {/* Protected Owner Routes */}
        <Route element={<ProtectedRoute requiredRole="owner" />}>
          <Route path="/dashboard" element={<OwnerDashboard />}>
            <Route index element={<h2>Welcome to Dashboard</h2>} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="billing" element={<BillingRevenue />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="waste" element={<WasteManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="leave-requests" element={<LeaveRequests />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;