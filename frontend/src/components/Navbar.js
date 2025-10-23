import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ unreadCount = 0 }) {
  const handleLogout = () => {
    signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 25px",
        background: "#1e1e2f", // Dark navy background
        color: "#fff",
        alignItems: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <h2 style={{ color: "#61dafb", fontWeight: "bold", margin: 0 }}>
        SkillSync
      </h2>

      {user && (
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "500",
              position: "relative",
            }}
          >
            Home
          </Link>

          <Link
            to="/messages"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "500",
              position: "relative",
            }}
          >
            Messages
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-12px",
                  background: "#ff4d4d", // Red badge
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 7px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  boxShadow: "0 0 2px rgba(0,0,0,0.3)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            to="/profile"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: "none",
              background: "#ff4d4d", // Red button
              color: "#fff",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e04343")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ff4d4d")}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
