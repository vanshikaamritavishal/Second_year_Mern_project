import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";

function Login() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send Google user info to backend
      const res = await axios.post("/api/auth/google", {
        googleId: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      console.log("Backend response:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to SkillSync 🚀</h1>
      <button
        onClick={handleLogin}
        style={{
          padding: "12px 24px",
          borderRadius: "8px",
          background: "#4285F4",
          color: "#fff",
          fontWeight: "bold",
          marginTop: "20px",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
