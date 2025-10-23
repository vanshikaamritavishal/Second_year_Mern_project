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
    // eslint-disable-next-line
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

    // Optional validation for Calendly link
    if (
      profile.calendlyLink &&
      !profile.calendlyLink.startsWith("https://calendly.com/")
    ) {
      alert("Please enter a valid Calendly link (starting with https://calendly.com/)");
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
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>Profile</h1>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={profile.name}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "8px 0" }}
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={profile.age}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "8px 0" }}
      />
      <input
        type="text"
        name="college"
        placeholder="College"
        value={profile.college}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "8px 0" }}
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={profile.state}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "8px 0" }}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={profile.city}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "8px 0" }}
      />
      <input
        type="text"
        name="linkedIn"
        placeholder="LinkedIn URL"
        value={profile.linkedIn}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "8px 0" }}
      />

      {/* Profession Dropdown */}
      <select
        name="profession"
        value={profile.profession}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          borderRadius: "6px",
        }}
        required
      >
        <option value="">Select Profession</option>
        <option value="Student">Student</option>
        <option value="Software Developer">Software Developer</option>
        <option value="Designer">Designer</option>
        <option value="Data Analyst">Data Analyst</option>
        <option value="Entrepreneur">Entrepreneur</option>
        <option value="Other">Other</option>
      </select>

      {/* Optional Calendly Link */}
      <input
        type="text"
        name="calendlyLink"
        placeholder="Calendly Link (optional)"
        value={profile.calendlyLink}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "8px 0" }}
      />

      {/* Skills */}
      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Add skill"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSkillAdd()}
          style={{ padding: "8px", width: "70%" }}
        />
        <button
          onClick={handleSkillAdd}
          style={{ padding: "8px 12px", marginLeft: "10px" }}
        >
          Add
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        {profile.skills.map((skill) => (
          <span
            key={skill}
            style={{
              display: "inline-block",
              background: "#ddd",
              padding: "5px 10px",
              borderRadius: "15px",
              margin: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleSkillRemove(skill)}
          >
            {skill} ×
          </span>
        ))}
      </div>

      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Save Profile
      </button>
    </div>
  );
}
