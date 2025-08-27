import { useState } from "react";
import { uploadTimetable } from "../../services/timetableService";

const UploadTimetable = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please choose a file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Always bulk mode (no Room ID)
      await uploadTimetable(undefined, formData);
      setMessage("Timetable uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error("Upload failed", err);
      setMessage("Upload failed. Try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Upload Timetable</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <p className="text-sm text-gray-600">Upload a CSV/XLSX. Include columns: Name, Building, Department, Day, Start/End Time, Subject (Faculty optional). Rooms will be created automatically.</p>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
};

export default UploadTimetable;
