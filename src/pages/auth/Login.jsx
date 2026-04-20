import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (/^[A-Z]/.test(formData.email)) {
      newErrors.email = "Email should not start with a capital letter";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setFormData({ ...formData, [name]: value.toLowerCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      // Use auth context login
      const success = login(formData);
      if (success) {
        // Save user (optional)
        localStorage.setItem("user", JSON.stringify({ email: formData.email, role: formData.role }));

        // Dynamic navigation based on role
        if (formData.role === "owner") {
          navigate("/dashboard");
        } else if (formData.role === "student") {
          navigate("/student");
        }
      } else {
        setErrors({ api: "Invalid credentials" });
      }

    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          {/* Role */}
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="owner">Owner</option>
            <option value="student">Student</option>
          </select>
          {errors.role && <span className="error">{errors.role}</span>}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          {/* API Error */}
          {errors.api && <span className="error">{errors.api}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>Don't have an account? <a href="#" onClick={() => navigate("/signup")}>Create Account</a></p>
      </div>
    </div>
  );
};

export default Login;