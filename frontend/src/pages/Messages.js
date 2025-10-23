import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function Messages() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [allUsers, setAllUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map((doc) => doc.data());
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  // Fetch incoming requests
  useEffect(() => {
    if (!allUsers.length) return;
    const q = query(collection(db, "requests"), where("toId", "==", user.googleId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(reqs.filter((r) => r.status === "pending"));
    });
    return () => unsubscribe();
  }, [allUsers]);

  // Fetch accepted users
  useEffect(() => {
    if (!allUsers.length) return;
    const q = query(collection(db, "requests"), where("status", "==", "accepted"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let accepted = snapshot.docs
        .map((doc) => doc.data())
        .filter((r) => r.fromId === user.googleId || r.toId === user.googleId)
        .map((r) => {
          const otherId = r.fromId === user.googleId ? r.toId : r.fromId;
          const otherUser = allUsers.find((u) => u.googleId === otherId);
          return otherUser ? { id: otherId, name: otherUser.name } : null;
        })
        .filter(Boolean);

      const unique = Array.from(new Map(accepted.map((u) => [u.id, u])).values());
      setAcceptedUsers(unique);
    });
    return () => unsubscribe();
  }, [allUsers]);

  // Fetch messages
  useEffect(() => {
    if (!selectedUser || !allUsers.length) return;
    const chatId = [user.googleId, selectedUser.id].sort().join("_");
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [selectedUser, allUsers]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Track unread messages
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("toId", "==", user.googleId),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts = {};
      snapshot.docs.forEach((docSnap) => {
        const msg = docSnap.data();
        const otherId = msg.fromId;
        counts[otherId] = (counts[otherId] || 0) + 1;
      });
      setUnreadCounts(counts);
    });

    return () => unsubscribe();
  }, []);

  // Mark messages as read when a chat is opened
  useEffect(() => {
    if (!selectedUser) return;
    const chatId = [user.googleId, selectedUser.id].sort().join("_");
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      where("toId", "==", user.googleId),
      where("read", "==", false)
    );

    const markRead = async () => {
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(async (docSnap) => {
        await updateDoc(doc(db, "messages", docSnap.id), { read: true });
      });
    };
    markRead();
  }, [selectedUser]);

  const acceptRequest = async (req) => {
    const requestRef = doc(db, "requests", req.id);
    await updateDoc(requestRef, { status: "accepted" });
    const fromUser = allUsers.find((u) => u.googleId === req.fromId);
    alert(`Request from ${fromUser?.name || "Someone"} has been accepted.`);
  };

  const rejectRequest = async (req) => {
    const requestRef = doc(db, "requests", req.id);
    await updateDoc(requestRef, { status: "rejected" });
    const fromUser = allUsers.find((u) => u.googleId === req.fromId);
    alert(`Request from ${fromUser?.name || "Someone"} has been rejected.`);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    const chatId = [user.googleId, selectedUser.id].sort().join("_");
    await addDoc(collection(db, "messages"), {
      chatId,
      fromId: user.googleId,
      toId: selectedUser.id,
      message: newMessage,
      timestamp: serverTimestamp(),
      read: false,
    });
    setNewMessage("");
  };

  // --- UI ---
  return (
    <div
      style={{
        display: "flex",
        height: "80vh",
        margin: "20px auto",
        maxWidth: "900px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left Sidebar: Chats + Requests */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          background: "#f8f9fa",
        }}
      >
        <h2 style={{ textAlign: "center", padding: "15px 0", borderBottom: "1px solid #ddd" }}>
          Chats
        </h2>

        {/* Incoming Requests */}
        <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
          <h4>Requests</h4>
          {requests.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#777" }}>No requests</p>
          ) : (
            requests.map((req) => {
              const fromUser = allUsers.find((u) => u.googleId === req.fromId);
              return (
                <div
                  key={req.id}
                  style={{
                    background: "#fff",
                    padding: "8px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <p style={{ margin: "0 0 5px 0" }}>From: {fromUser?.name || "Unknown"}</p>
                  <button
                    onClick={() => acceptRequest(req)}
                    style={{
                      marginRight: "5px",
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(req)}
                    style={{
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Accepted Users (Chat List) */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {acceptedUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              style={{
                padding: "12px 15px",
                cursor: "pointer",
                background:
                  selectedUser?.id === u.id ? "#d1f0ff" : "transparent",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#eef6ff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  selectedUser?.id === u.id ? "#d1f0ff" : "transparent")
              }
            >
              <strong>{u.name}</strong>
              {unreadCounts[u.id] > 0 && (
                <span
                  style={{
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 7px",
                    fontSize: "12px",
                  }}
                >
                  {unreadCounts[u.id]}
                </span>
              )}
            </div>
          ))}
          {acceptedUsers.length === 0 && (
            <p style={{ textAlign: "center", color: "#777", marginTop: "10px" }}>No chats yet</p>
          )}
        </div>
      </div>

      {/* Right Chat Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedUser ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "15px",
                borderBottom: "1px solid #ddd",
                background: "#f0f0f0",
                fontWeight: "bold",
              }}
            >
              Chat with {selectedUser.name}
            </div>

            {/* Chat messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "15px",
                background: "#e5ddd5",
              }}
            >
              {messages.length === 0 && (
                <p style={{ textAlign: "center", color: "#666" }}>No messages yet.</p>
              )}
              {messages.map((msg, idx) => {
                const isSent = msg.fromId === user.googleId;
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: isSent ? "flex-end" : "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "10px 15px",
                        borderRadius: "15px",
                        background: isSent ? "#4CAF50" : "#fff",
                        color: isSent ? "#fff" : "#000",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                display: "flex",
                padding: "10px",
                borderTop: "1px solid #ddd",
                background: "#fafafa",
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  marginLeft: "10px",
                  padding: "10px 15px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "18px",
            }}
          >
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
