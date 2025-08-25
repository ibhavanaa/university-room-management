import React, { useState } from "react";

function CreateAlert() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/alerts
    console.log({ message, type });
    alert("Alert created successfully ✅");
    setMessage("");
    setType("info");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Alert</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-4 max-w-lg"
      >
        <div className="mb-4">
          <label className="block mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded p-2"
            rows="3"
            placeholder="Enter alert message"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Alert
        </button>
      </form>
    </div>
  );
}

export default CreateAlert;
