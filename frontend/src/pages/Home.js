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

  // Function to send a request to another user
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

      {/* Users List */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              {/* Profile Photo */}
              {u.photoURL && (
                <img
                  src={u.photoURL}
                  alt={u.name}
                  style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px" }}
                />
              )}

              <h3>{u.name}</h3>
              <p>{u.college}</p>

              {/* LinkedIn link */}
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

              {/* Skills Tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {u.skills?.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: "#ddd",
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

              {/* Send Request Button */}
              <button
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => sendRequest(u)}
              >
                Send Request
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
