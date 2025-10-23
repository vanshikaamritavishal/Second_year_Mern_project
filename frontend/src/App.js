import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Messages from "./pages/Messages";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [unreadCounts, setUnreadCounts] = useState({});

  // Track unread messages globally
  useEffect(() => {
    if (!user) return;

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
  }, [user]);

  // Total unread messages
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <Router>
      <Navbar unreadCount={totalUnread} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages unreadCounts={unreadCounts} />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
