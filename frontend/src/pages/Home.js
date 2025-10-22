import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

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

  return (
    <div style={{ padding: "20px" }}>
      {/* Welcome */}
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
                onClick={() => alert(`Send request to ${u.name}`)}
              >
                Send Request
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
