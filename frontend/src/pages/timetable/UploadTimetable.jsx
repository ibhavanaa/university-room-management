import React, { useState } from "react";
import { uploadTimetable } from "../../services/roomService";

function UploadTimetable() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const formData = new FormData();
      formData.append("timetable", file);
      await uploadTimetable(formData);
      setMessage("Timetable uploaded successfully!");
      setFile(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Upload Timetable</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Excel File
            </label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Upload Timetable"}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadTimetable;