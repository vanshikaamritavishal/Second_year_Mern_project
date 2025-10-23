import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const allUsers = [];
        querySnapshot.forEach((doc) => {
          allUsers.push(doc.data());
        });
        setUsers(allUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Send connection request
  const sendRequest = async (toUser) => {
    try {
      await addDoc(collection(db, "requests"), {
        fromId: user.googleId,
        toId: toUser.googleId,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      alert(`Request sent to ${toUser.name}`);
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Welcome Section */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h1>👋 Welcome, {user?.name || "Guest"}</h1>
        {!user && <p>Log in to see other users.</p>}
      </div>

      {/* Users Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {users
          .filter((u) => u.googleId !== user?.googleId) // exclude current user
          .map((u) => (
            <div
              key={u.googleId}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "12px",
                textAlign: "center",
                background: "#fafafa",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {/* Profile Photo */}
              {u.photoURL && (
                <img
                  src={u.photoURL}
                  alt={u.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    marginBottom: "10px",
                  }}
                />
              )}

              {/* Name */}
              <h3>{u.name}</h3>

              {/* Age */}
              {u.age && (
                <p style={{ color: "#666", margin: "4px 0" }}>
                  {u.age}
                </p>
              )}

              {/* Profession */}
              {u.profession && (
                <p style={{ fontWeight: "bold", color: "#333" }}>
                  {u.profession}
                </p>
              )}

              {/* Location */}
              {(u.city || u.state) && (
                <p style={{ color: "#555" }}>
                  📍 {u.city && `${u.city}, `}{u.state}
                </p>
              )}

              {/* LinkedIn */}
              {u.linkedIn && (
                <p>
                  <a
                    href={u.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0A66C2", textDecoration: "underline" }}
                  >
                    LinkedIn Profile
                  </a>
                </p>
              )}

              {/* Skills */}
              {u.skills?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  {u.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: "#e0e0e0",
                        borderRadius: "12px",
                        padding: "4px 10px",
                        margin: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div style={{ marginTop: "15px" }}>
                {/* Send Request */}
                <button
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    marginRight: "8px",
                  }}
                  onClick={() => sendRequest(u)}
                >
                  Send Request
                </button>

                {/* Calendly Button (only if available) */}
                {u.calendlyLink && (
                  <button
                    style={{
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: "#0056D2",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={() => window.open(u.calendlyLink, "_blank")}
                  >
                    Book Meeting
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
