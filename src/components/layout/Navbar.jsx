import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <div style={{ padding: "10px", background: "#333", color: "white" }}>
      <span>Mess Management - Owner</span>
      <button onClick={logout} style={{ float: "right" }}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;