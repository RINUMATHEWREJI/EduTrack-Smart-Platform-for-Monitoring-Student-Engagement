import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}profile/teacher/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setProfile(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await axios.patch(`${API_URL}profile/teacher/`, formData, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setProfile(res.data);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="teacher-profile">
      <h2>My Profile</h2>

      {editing ? (
        <div>
          <label>
            Name:
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </label>
          <label>
            Bio:
            <input
              type="text"
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </label>
          <label>
            Department:
            <input
              type="text"
              value={formData.department || ""}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            />
          </label>
          <label>
            Gender:
            <input
              type="text"
              value={formData.gender || ""}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </label>

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {profile.name || "-"}</p>
          <p><strong>Bio:</strong> {profile.bio || "-"}</p>
          <p><strong>Department:</strong> {profile.department || "-"}</p>
          <p><strong>Gender:</strong> {profile.gender || "-"}</p>
          <p><strong>Phone:</strong> {profile.phone || "-"}</p>

          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default TeacherProfile;
