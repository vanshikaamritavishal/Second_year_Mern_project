import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

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
    <div
      style={{
        padding: "20px",
        background: "#f5f1e8", // beige background
        minHeight: "100vh",
        color: "#333",
      }}
    >
      {/* Welcome Section */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h1 style={{ color: "#1e1e2f" }}>
          👋 Welcome, {user?.name || "Guest"}
        </h1>
        {!user && <p style={{ color: "#666" }}>Log in to see other users.</p>}
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
                borderRadius: "12px",
                padding: "16px",
                background: "#fff8f0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.2s",
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
                    objectFit: "cover",
                    marginBottom: "12px",
                    border: "2px solid #b5895b",
                  }}
                />
              )}

              {/* User Info */}
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                {/* Name */}
                <h3
                  style={{
                    color: "#333",
                    margin: "0 0 6px 0",
                    fontSize: "18px",
                    fontWeight: "700",
                    lineHeight: "1.2",
                  }}
                >
                  {u.name}
                </h3>

                {/* Age & Profession */}
                <div
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {u.age && <span>Age: {u.age} yrs</span>}
                  {u.profession && <span>Profession: {u.profession}</span>}
                </div>
                {/* College */}
                {u.college && (
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "8px",
                      textAlign: "center",
                    }}
                  >
                    🎓 {u.college}
                  </div>
                )}

                {/* Location & LinkedIn */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#555",
                    flexWrap: "wrap",
                    marginBottom: u.skills?.length > 0 ? "6px" : "10px",
                  }}
                >
                  {(u.city || u.state) && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      📍 {u.city && `${u.city}, `}
                      {u.state}
                    </span>
                  )}
                  {u.linkedIn && (
                    <a
                      href={u.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#0A66C2",
                        textDecoration: "underline",
                        fontWeight: "500",
                      }}
                    >
                      LinkedIn
                    </a>
                  )}
                </div>

                {/* Skills */}
                {u.skills?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginTop: "6px",
                    }}
                  >
                    {u.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          background: "#b5895b33",
                          borderRadius: "20px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: "500",
                          color: "#333",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {/* Send Request */}
                <button
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    fontWeight: "500",
                    transition: "background 0.2s",
                  }}
                  onClick={() => sendRequest(u)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#43a047")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#4CAF50")
                  }
                >
                  Send Request
                </button>

                {/* Calendly Button */}
                {u.calendlyLink && (
                  <button
                    style={{
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: "#b5895b",
                      color: "#fff",
                      border: "none",
                      fontWeight: "500",
                      transition: "background 0.2s",
                    }}
                    onClick={() => window.open(u.calendlyLink, "_blank")}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#a1794e")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#b5895b")
                    }
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
