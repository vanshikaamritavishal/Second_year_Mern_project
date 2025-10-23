import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";

function Login() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await axios.post("/api/auth/google", {
        googleId: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f1e8",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "40px 30px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          textAlign: "center",
          lineHeight: "1.5",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "16px",
            color: "#1e1e2f",
            fontWeight: "700",
          }}
        >
          Welcome to SkillSync 🚀
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#555",
            marginBottom: "32px",
            fontWeight: "400",
          }}
        >
          Connect with professionals, showcase your skills, and grow your network.
        </p>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            background: "#4285F4",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#357ae8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#4285F4")}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
