import { Link } from "react-router-dom";
import "../../styles/layout.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Mess Owner</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/students">Students</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/billing">Billing</Link></li>
        <li><Link to="/complaints">Complaints</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/staff">Staff</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;