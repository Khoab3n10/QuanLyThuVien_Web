import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiRequest, MOCK_DATA } from "../config/api";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Thử kết nối với backend
      const data = await apiRequest("/api/Auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      console.log("=== Login Response ===");
      console.log("Backend data:", data);

      // Map role from backend to frontend
      let mappedRole = data.role?.trim();
      console.log("Original role from backend:", mappedRole);

      const userData = {
        userId: data.userId,           // ✅ ADD USER ID
        username: data.username,
        role: mappedRole,
        email: data.email,
        docGiaId: data.docGiaId,      // ✅ ADD DocGia ID for readers
      };

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("=== Stored Data ===");
      console.log("Token stored:", !!data.token);
      console.log("User data stored:", userData);
      console.log("User ID:", userData.userId);
      console.log("DocGia ID:", userData.docGiaId);

      onLogin(userData);
      onClose();

      // Redirect based on role
      console.log("=== Redirect Logic ===");
      console.log("Checking role:", mappedRole);

      setTimeout(() => {
        switch (mappedRole) {
          case "Reader":
            navigate("/reader/home");
            break;
          case "Librarian":
            navigate("/librarian/dashboard");
            break;
          case "Accountant":
          case "Nhân viên Accountant":
            navigate("/accountant/dashboard");
            break;
          case "Nhân viên kho sách":
          case "Trưởng kho":
          case "warehouse":
          case "Warehouse":
            console.log(
              "Warehouse role detected, navigating to /warehouse/dashboard"
            );
            navigate("/warehouse/dashboard");
            break;
          case "Trưởng thư viện":
            navigate("/manager/dashboard");
            break;
          case "Admin":
            navigate("/admin");
            break;
          default:
            console.log("No matching role, navigating to /");
            navigate("/");
        }
      }, 100);
    } catch (err) {
      console.error("Login error:", err);

      // Fallback: Sử dụng dữ liệu mẫu nếu backend không có sẵn
      if (
        err.message.includes("fetch") ||
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError")
      ) {
        console.log("Backend không có sẵn, sử dụng dữ liệu mẫu...");

        const mockUser = MOCK_DATA.users[formData.username];
        if (mockUser && formData.password === "admin123") {
          // Get specific reader profile if it's a reader
          const readerProfile = mockUser.role === "Reader" ? MOCK_DATA.readerProfiles[formData.username] : null;
          
          const userData = {
            userId: readerProfile ? readerProfile.id : Math.floor(Math.random() * 1000),
            username: mockUser.username,
            role: mockUser.role,
            email: mockUser.email,
            docGiaId: readerProfile ? readerProfile.id : (mockUser.role === "Reader" ? Math.floor(Math.random() * 1000) : null),
          };

          localStorage.setItem("token", "mock_token_" + Date.now());
          localStorage.setItem("user", JSON.stringify(userData));

          onLogin(userData);
          onClose();

          // Redirect based on role
          setTimeout(() => {
            switch (mockUser.role) {
              case "Reader":
                navigate("/reader/home");
                break;
              case "Librarian":
                navigate("/librarian/dashboard");
                break;
              case "Accountant":
                navigate("/accountant/dashboard");
                break;
              case "Nhân viên kho sách":
                navigate("/warehouse/dashboard");
                break;
              case "Admin":
                navigate("/admin");
                break;
              default:
                navigate("/");
            }
          }, 100);
        } else {
          setError("Tên đăng nhập hoặc mật khẩu không đúng");
        }
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <h2>Đăng nhập</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Mật khẩu
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
