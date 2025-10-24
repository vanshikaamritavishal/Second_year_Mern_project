import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [profile, setProfile] = useState({
    name: user?.name || "",
    age: "",
    linkedIn: "",
    college: "",
    state: "",
    city: "",
    skills: [],
    profession: "",
    calendlyLink: "",
  });

  const [skillInput, setSkillInput] = useState("");

  // Fetch profile from Firestore
  useEffect(() => {
    if (!user?.googleId) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.googleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile((prev) => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [user?.googleId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSkillAdd = () => {
    if (skillInput && !profile.skills.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput] });
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    });
  };

  const handleSave = async () => {
    if (!user?.googleId) {
      alert("User not found. Please log in again.");
      return;
    }

    if (
      profile.calendlyLink &&
      !profile.calendlyLink.startsWith("https://calendly.com/")
    ) {
      alert(
        "Please enter a valid Calendly link (starting with https://calendly.com/)"
      );
      return;
    }

    try {
      const updatedProfile = { ...user, ...profile };
      await setDoc(doc(db, "users", user.googleId), updatedProfile);
      localStorage.setItem("user", JSON.stringify(updatedProfile));
      alert("Profile saved!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile. Check console for details.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "750px",            // increased width
        width: "90%",                 // responsive
        margin: "50px auto",
        padding: "30px",              // more padding
        background: "#f5f1e8",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // stronger shadow
        color: "#333",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1e1e2f", marginBottom: "25px" }}>
        Profile
      </h1>

      {/* Input Fields */}
      {[
        { name: "name", placeholder: "Name", type: "text" },
        { name: "age", placeholder: "Age", type: "number" },
        { name: "college", placeholder: "College", type: "text" },
        { name: "state", placeholder: "State", type: "text" },
        { name: "city", placeholder: "City", type: "text" },
        { name: "linkedIn", placeholder: "LinkedIn URL", type: "text" },
        { name: "calendlyLink", placeholder: "Calendly Link (optional)", type: "text" },
      ].map((field) => (
        <input
          key={field.name}
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          value={profile[field.name]}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",         // increased padding
            margin: "10px 0",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
      ))}

      {/* Profession Dropdown */}
      <select
        name="profession"
        value={profile.profession}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "12px",
          margin: "10px 0",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
        required
      >
        <option value="">Select Profession</option>
        <option value="School Student">School Student</option>
        <option value="College Student">College Student</option>
        <option value="Professor">Professor</option>
        <option value="Data Analyst">Data Analyst</option>
        <option value="Mentor">Mentor</option>
        <option value="Other">Other</option>
      </select>

      {/* Skills */}
      <div
        style={{
          display: "flex",
          margin: "15px 0",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Add skill"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSkillAdd()}
          style={{
            flex: "1 1 60%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleSkillAdd}
          style={{
            padding: "12px 18px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#43a047")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#4CAF50")}
        >
          Add
        </button>
      </div>

      {/* Skill Tags */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        {profile.skills.map((skill) => (
          <span
            key={skill}
            style={{
              display: "inline-block",
              background: "#b5895b33",
              padding: "6px 14px",
              borderRadius: "20px",
              margin: "5px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            onClick={() => handleSkillRemove(skill)}
          >
            {skill} ×
          </span>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "14px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#43a047")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#4CAF50")}
      >
        Save Profile
      </button>
    </div>
  );
}
