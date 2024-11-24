import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import * as XLSX from "xlsx";

const Attainment = () => {
  const [fileName, setFileName] = useState("");

  const [allBatches, setAllBatches] = useState([]);
  const [batchId, setBatchId] = useState("");

  const getAllBatch = async () => {
    try {
      const response = await axiosInstance.get("/get-all-batches");

      if (response.data && response.data.batches) {
        console.log(response.data.batches);
        setAllBatches(response.data.batches);
      }
    } catch (error) {
      console.log("An Unexpected Error : " + error);
    }
  };

  useEffect(() => {
    getAllBatch();
  }, []);

  // Students Details fetching from Excel
  const [studentsData, setStudentsData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Extract "Registration Number" and "Student Name" for each row
        const processedData = jsonData.map((row) => ({
          registrationNumber: row["Registration Number"],
          studentName: row["Student Name"],
        }));

        // Update state with processed data
        setStudentsData(processedData);
        sendStudentData(processedData);
      };

      reader.readAsArrayBuffer(file);
    }
  };
  const sendStudentData = async (data) => {
    try {
      const response = await axiosInstance.post("/save-student-data", {
        studentsData: data,
      });
      console.log("Data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center justify-start">
        <h2 className="text-green-700">Select batch</h2>
        <select
          className="w-50 border rounded p-2 -mt-1"
          value={batchId}
          onChange={(e) => {
            setBatchId(e.target.value);
          }}
        >
          {allBatches.map(({ _id, batchName }) => {
            return <option value={_id}>{batchName}</option>;
          })}
        </select>
      </div>
      <div className="flex items-center justify-center w-full mt-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <h2 className="font-semibold text-green-500 ">CO-PO Attainment</h2>
          <label
            htmlFor="excelUpload"
            className=" w-[100%]  flex items-center justify-center p-3 bg-green-500 text-white rounded shadow-md cursor-pointer font-medium"
          >
            {fileName || "Upload Students File"}
          </label>
          <input
            id="excelUpload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Link
            to="/dashboard/dataEntry"
            className="bg-green-500 p-3 rounded text-white font-medium"
          >
            Attainment Data-Entry
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Extracted Data</h3>
        <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 border-b-2">Registration Number</th>
              <th className="px-6 py-3 border-b-2">Student Name</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="px-6 py-3 border-b">{row.registrationNumber}</td>
                <td className="px-6 py-3 border-b">{row.studentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Attainment;
