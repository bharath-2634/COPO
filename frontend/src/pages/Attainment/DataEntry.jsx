import React from "react";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

const DataEntry = () => {
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

  const [allBatch, setAllBatch] = useState([]);
  const [subjectId, setSubjectId] = useState("");

  const getAllSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("token from client Side : " + token);
      console.log("batchId from client Side : " + batchId);

      const response = await axiosInstance.get("/get-allSubjects/" + batchId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(
        "Batch Data client side :",
        JSON.stringify(allBatch, null, 2)
      );
      if (response.data && response.data.subjectData) {
        const subjectsData = response.data.subjectData.flatMap(
          (batch) => batch.subjects
        );
        setAllBatch(subjectsData);
        console.log(
          "Subjects Data array from client model : " +
            JSON.stringify(subjectsData, null, 2)
        );
      }
    } catch (error) {
      console.log("An Unexpected Error from client side : " + error);
    }
  };

  const [subjects, setAllSubjects] = useState([]);
  const [courseNumber, setCourseNumber] = useState([]);

  const getSubjects = () => {
    const names = allBatch.map((subject) => subject.courseName);
    const cono = allBatch.map((subject) => subject.coNo);
    setCourseNumber(cono);
    setAllSubjects(names);
  };

  useEffect(() => {
    getAllSubjects();
    getSubjects();
  }, [batchId]);

  const [Iat, setIat] = useState(["IAT 1", "IAT 2", "IAT 3"]);
  const [selectIat, setSelectIat] = useState("");

  const [openUpload, setOpenUpload] = useState(false);

  // const generateExcel = () => {
  //   const data = [
  //     ["Name", "Age", "Score", "Total"],
  //     ["John", 25, 50, null],
  //     ["Alice", 30, 80, null],
  //     ["Bob", 28, 70, null],
  //   ];

  //   const worksheet = XLSX.utils.aoa_to_sheet(data);

  //   worksheet["D2"] = "C2+20";
  //   worksheet["D3"] = "C3+20";
  //   worksheet["D4"] = "C4+20";

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  //   workbook.Workbook = {
  //     CalcPr: {
  //       fullCalcOnLoad: true,
  //     },
  //   };

  //   XLSX.writeFile(workbook, "GeneratedExcel.xlsx");
  // };

  // Handleing uploading Excel Sheet Concept
  const handleUpload = () => {
    setOpenUpload(false);
    // Handle Upload Event for excel sheet
  };

  // Handling Generate Excel Sheet concept

  const [generatemodel, setgeneratemodel] = useState(false);

  const [headers, setHeaders] = useState([]);

  const generateSheet = (e) => {
    e.preventDefault();
    const mainHeader = ["S.NO", "REGISTER NUMBER", "STUDENT"];

    console.log("Excel Data Strcuture : " + JSON.stringify(headers, null, 2));
    headers.map((object, idx) => {
      mainHeader.push(object.CO);
      const selectedLevels = Object.entries(object.checkboxes)
        .filter(([key, value]) => value.checked)
        .map(([key]) => key);
      selectedLevels.forEach((level) => {
        mainHeader.push(level);
      });
      // working good
      // console.log(`Main Header : ${mainHeader}`)
    });

    mainHeader.push("Marks (out of 100) ");
    const selectedAssignmentLevels = Object.entries(assignmentLevels)
      .filter(([key, value]) => value.checked)
      .map(([key]) => key);
    selectedAssignmentLevels.forEach((level) => {
      mainHeader.push(level);
    });
    mainHeader.push(assignmentCo);
    mainHeader.push("Marks out of 100");

    console.log("final Main Header of Excel Sheet : " + mainHeader);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Static Headers Data");
    mainHeader.forEach((header, index) => {
      const cell = sheet.getCell(1, index + 1);
      cell.value = header;
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { bottom: { style: "thin" } };
    });

    for (let rowIndex = 1; rowIndex <= 10; rowIndex++) {
      const row = sheet.getRow(rowIndex + 1);
      row.getCell(1).value = rowIndex;
      row.getCell(4).value = "";
      row.getCell(9).value = "";
      const [colIdx, setColIdx] = useState(5);
      const [rowIdx, setRowIdx] = useState(0);
      const columns = ["E", "F", "G", "H", "J", "K", "L", "M"];

      headers.map((object, idx) => {
        const maxCo = object.marks;
        const selectedLevels = Object.entries(object.checkboxes)
          .filter(([level, { checked }]) => checked)
          .map(([level, { mark }]) => mark);
        selectedLevels.forEach((val) => {
          row.getCell(colIdx).value = {
            formula: `ROUND(${columns[rowIdx]}${rowIndex + 1} * ${
              val / maxCo
            }, 0)`,
          };
          setColIdx((idx) => idx + 1);
          setRowIdx((idx) => idx + 1);
        });
        setColIdx((idx) => idx + 1);
      });
      // row.getCell(5).value = { formula: `ROUND(E${rowIndex + 1} * ${levelMarks.CO1.L1 / maxCO1}, 0)` };
      // row.getCell(6).value = { formula: `ROUND(H${rowIndex + 1} * ${levelMarks.CO1.L2 / maxCO1}, 0)` };
      // row.getCell(7).value = { formula: `ROUND(H${rowIndex + 1} * ${levelMarks.CO1.L3 / maxCO1}, 0)` };
      // row.getCell(8).value = { formula: `H${rowIndex + 1} - (D${rowIndex + 1} + E${rowIndex + 1} + F${rowIndex + 1})` };
    }

    setgeneratemodel(false);
  };

  const [selectedCO, setSelectedCO] = useState("");
  const [marks, setMarks] = useState("");
  const [entryData, setEntryData] = useState([]);

  const [assselectedCO, setassSelectedCO] = useState("");
  const [assmarks, setassMarks] = useState("");
  const [assignmentData, setAssignmentData] = useState([]);

  const nextentrydata = (e) => {
    e.preventDefault();

    setEntryData([...entryData, { selectedCO, marks }]);
    console.log(entryData);
    setSelectedCO("");
    setMarks("");
  };

  const nextassigment = (e) => {
    e.preventDefault();

    setAssignmentData([...assignmentData, { assselectedCO, assmarks }]);
    console.log(assignmentData);
    setassSelectedCO("");
    setassMarks("");
  };

  return (
    <>
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-2 items-center justify-center">
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

        <div className="flex gap-3">
          <h2 className="text-green-700">Select Subject</h2>
          {console.log("selected subject : " + subjectId)}
          <select
            className="w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
            }}
          >
            {subjects.map((subject, idx) => {
              return <option value={idx}>{subject}</option>;
            })}
          </select>
        </div>
        <div className="flex gap-3">
          <h2 className="text-green-700">Select IAT</h2>
          <select
            className="w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto"
            value={selectIat}
            onChange={(e) => {
              setSelectIat(e.target.value);
            }}
          >
            {Iat.map((iat, idx) => {
              return <option value={idx}>{iat}</option>;
            })}
          </select>
        </div>

        <button
          className="flex items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium"
          onClick={(e) => {
            setOpenUpload(true);
          }}
        >
          <IoMdCloudUpload />
          <h2>Upload</h2>
        </button>

        {openUpload && (
          <Modal
            isOpen={openUpload}
            onRequestClose={() => {}}
            ariaHideApp={false}
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,.2)",
              },
            }}
            contentlabel=""
            className="w-[30%] max-h-2/4 bg-white rounded-md mx-auto mt-40 p-5"
          >
            <div className="flex flex-col p-1 gap-2">
              <div className="w-full flex items-center justify-between">
                <h2>Upload Excel</h2>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center -mt-2 hover:bg-slate-50"
                  onClick={(e) => {
                    setOpenUpload(false);
                  }}
                >
                  <MdClose className="text-xl text-slate-400" />
                </button>
              </div>
              <div className="flex items-center justify-center w-full ml-5 mt-4">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="mb-4 "
                  onChange={(e) => {
                    handleUpload();
                  }}
                />
              </div>

              <p className="text-red-500 text-sm">
                Please ensure that uploaded excel is in the required format
              </p>
            </div>
          </Modal>
        )}

        <button
          className="flex items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium"
          onClick={() => setgeneratemodel(true)}
        >
          <MdOutlineCreateNewFolder className="text-lg" />
          <h2>generate</h2>
        </button>
      </div>
      <div>
        {generatemodel && (
          <Modal
            isOpen={generatemodel}
            onRequestClose={() => setgeneratemodel(false)}
            ariaHideApp={false}
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,.2)",
              },
            }}
            className="w-[65%] max-h-2/4 bg-white  rounded-md mx-auto mt-1 p-5"
          >
            <div className="flex flex-col p-1 gap-3">
              <div className="w-full flex items-center justify-between">
                <h2>Enter Data</h2>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center -mt-2 hover:bg-slate-50"
                  onClick={() => setgeneratemodel(false)}
                >
                  <MdClose className="text-xl text-slate-400" />
                </button>
              </div>

              <form className="mt-2">
                {/* Input Form Box */}
                <div className="flex flex-col w-full items-center justify-center gap-4">
                  <div className="flex items-center justify-start w-full gap-12">
                    <div className="flex flex-col gap-1 mt-3">
                      <h3 className="text-sm text-slate-400 font-medium">
                        CO.NO
                      </h3>
                      <select
                        className="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                        value={selectedCO}
                        onChange={(e) => setSelectedCO(e.target.value)}
                      >
                        <option value="">Select CO</option>
                        <option value="CO1">CO1</option>
                        <option value="CO2">CO2</option>
                        <option value="CO3">CO3</option>
                        <option value="CO4">CO4</option>
                        <option value="CO5">CO5</option>
                        <option value="CO6">CO6</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 mt-3">
                      <h3 className="text-sm text-slate-400 font-medium">
                        Marks
                      </h3>
                      <input
                        type="text"
                        className="block rounded-md border-0 py-1 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="Enter marks"
                      />
                    </div>
                    <button
                      className="bg-green-500 p-1 rounded flex items-center justify-center text-white font-medium mt-8 gap-3"
                      onClick={(e) => {
                        nextentrydata(e);
                      }}
                    >
                      <IoIosAddCircle />
                      <h2>Next column</h2>
                    </button>
                  </div>
                </div>
                {/* <div className="w-full flex items-center justify-end ">
                 
                </div> */}
                <hr className="mt-5 font-medium" />
                <div className="flex w-full flex-col items-start justify-center mt-8 gap-3">
                  <h2 className="">Assignment Entry</h2>
                  <div className="flex items-center justify-start w-full gap-12">
                    <div className="flex flex-col gap-1 mt-3">
                      <h3 className="text-sm text-slate-400 font-medium">
                        CO.NO
                      </h3>
                      <select
                        className="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                        value={assselectedCO}
                        onChange={(e) => setassSelectedCO(e.target.value)}
                      >
                        <option value="">Select CO</option>
                        <option value="CO1">CO1</option>
                        <option value="CO2">CO2</option>
                        <option value="CO3">CO3</option>
                        <option value="CO4">CO4</option>
                        <option value="CO5">CO5</option>
                        <option value="CO6">CO6</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 mt-3">
                      <h3 className="text-sm text-slate-400 font-medium">
                        Marks
                      </h3>
                      <input
                        type="text"
                        className="block rounded-md border-0 py-1 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                        value={assmarks}
                        onChange={(e) => setassMarks(e.target.value)}
                        placeholder="Enter marks"
                      />
                    </div>
                    <button
                      className="bg-green-500 p-1 rounded flex items-center justify-center text-white font-medium mt-8 gap-3"
                      onClick={(e) => {
                        nextassigment(e);
                      }}
                    >
                      <IoIosAddCircle />
                      <h2>Next column</h2>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default DataEntry;
