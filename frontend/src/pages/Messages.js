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
  serverTimestamp
} from "firebase/firestore";

export default function Messages() {
   
  const user = JSON.parse(localStorage.getItem("user"));
  const [allUsers, setAllUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  // Step 2: console log the current user Google ID
  console.log("Current user Google ID:", user.googleId);

  // Fetch all users for name mapping
  useEffect(() => {
    if (selectedUser?.id) {
  const chatId = [user.googleId, selectedUser.id].sort().join("_");
  console.log("Generated chatId:", chatId);
}
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map(doc => doc.data());
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  // Fetch incoming requests
  useEffect(() => {
    if (!allUsers.length) return;
    const q = query(collection(db, "requests"), where("toId", "==", user.googleId));
    const unsubscribe = onSnapshot(q, snapshot => {
      const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(reqs.filter(r => r.status === "pending"));
    });
    return () => unsubscribe();
  }, [allUsers]);

  // Fetch accepted users (deduplicated)
  useEffect(() => {
    if (!allUsers.length) return;
    const q = query(collection(db, "requests"), where("status", "==", "accepted"));
    const unsubscribe = onSnapshot(q, snapshot => {
      let accepted = snapshot.docs
        .map(doc => doc.data())
        .filter(r => r.fromId === user.googleId || r.toId === user.googleId)
        .map(r => {
          const otherId = r.fromId === user.googleId ? r.toId : r.fromId;
          const otherUser = allUsers.find(u => u.googleId === otherId);
          return otherUser ? { id: otherId, name: otherUser.name } : null;
        })
        .filter(Boolean);

      // Deduplicate by id
      const unique = Array.from(new Map(accepted.map(u => [u.id, u])).values());
      setAcceptedUsers(unique);
    });
    return () => unsubscribe();
  }, [allUsers]);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUser || !allUsers.length) return;
    const chatId = [user.googleId, selectedUser.id].sort().join("_");
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [selectedUser, allUsers]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const acceptRequest = async (req) => {
    const requestRef = doc(db, "requests", req.id);
    await updateDoc(requestRef, { status: "accepted" });
  };

  const rejectRequest = async (req) => {
    const requestRef = doc(db, "requests", req.id);
    await updateDoc(requestRef, { status: "rejected" });
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
    });
    setNewMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Messages & Requests</h1>

      {/* Incoming Requests */}
      <h2>Incoming Requests</h2>
      {requests.length === 0 && <p>No requests</p>}
      {requests.map(req => {
        const fromUser = allUsers.find(u => u.googleId === req.fromId);
        return (
          <div key={req.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
            <p>Request from: {fromUser?.name || req.fromId}</p>
            <button onClick={() => acceptRequest(req)}>Accept</button>
            <button onClick={() => rejectRequest(req)}>Reject</button>
          </div>
        );
      })}

      {/* Chat List */}
      <h2>Chats</h2>
      {acceptedUsers.length === 0 && <p>No chats yet</p>}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {acceptedUsers.map(u => (
          <button
            key={u.id}
            onClick={() => setSelectedUser(u)}
            style={{ padding: "6px 12px", borderRadius: "6px" }}
          >
            {u.name}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      {selectedUser && (
        <div>
          <h3>Chat with {selectedUser.name}</h3>
          <div
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              height: "300px",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            {messages.length === 0 && <p>No messages yet.</p>}
            {messages.map((msg, idx) => {
              const senderName = msg.fromId === user.googleId ? "You" : selectedUser.name;
              return (
                <div
                  key={idx}
                  style={{
                    textAlign: msg.fromId === user.googleId ? "right" : "left",
                    margin: "5px 0",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "12px",
                      background: msg.fromId === user.googleId ? "#4CAF50" : "#ddd",
                      color: msg.fromId === user.googleId ? "#fff" : "#000",
                    }}
                  >
                    {senderName}: {msg.message}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ padding: "8px", width: "80%", marginRight: "10px" }}
          />
          <button onClick={sendMessage} style={{ padding: "8px" }}>
            Send
          </button>
        </div>
      )}
    </div>
  );
}
