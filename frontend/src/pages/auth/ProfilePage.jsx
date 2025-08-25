import React, { useEffect, useState } from "react";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setMessage("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/auth/update-password",
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Password update failed.");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

        {message && <p className="text-center text-blue-600 mb-3">{message}</p>}

        <div className="space-y-2 mb-6">
          <p>
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {user.role}
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
