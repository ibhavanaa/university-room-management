// src/pages/admin/UserManagement.jsx
import React, { useEffect, useState } from "react";
import userService from "../../services/userService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", role: "student" });

  const loadUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      setUsers(res);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.email) return;
    await userService.createUser(newUser);
    setNewUser({ email: "", role: "student" });
    loadUsers();
  };

  const handleDelete = async (id) => {
    await userService.deleteUser(id);
    loadUsers();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      {/* Add User Form */}
      <div className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="User Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border rounded p-2 flex-1"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border rounded p-2"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleAddUser} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      {/* User List */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-200 text-left">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border">
              <td className="p-2">{u.email}</td>
              <td className="p-2 capitalize">{u.role}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center text-slate-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
