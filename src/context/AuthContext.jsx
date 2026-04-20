import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const signup = (userData) => {
    const existingUser = users.find(u => u.email === userData.email && u.role === userData.role);
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }
    const newUser = { email: userData.email, password: userData.password, role: userData.role };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    return { success: true };
  };

  const login = (userData) => {
    const foundUser = users.find(u => u.email === userData.email && u.password === userData.password && u.role === userData.role);
    if (foundUser) {
      setUser({ email: foundUser.email, role: foundUser.role });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
