import React from 'react'
import * as XLSX from "xlsx";
import { useState,useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";

const DataEntry = () => {


  const [allBatches,setAllBatches] = useState([]);
  const [batchId,setBatchId] = useState("");

  const getAllBatch = async () => {
    try {
        const response = await axiosInstance.get("/get-all-batches");

        if(response.data && response.data.batches) {
            console.log(response.data.batches);
            setAllBatches(response.data.batches);
        }
    }catch(error) {
        console.log("An Unexpected Error : "+error);
    }
  }

  useEffect(()=>{
    getAllBatch()
  },[]);

  const [allBatch,setAllBatch] = useState([]);
  const [subjectId,setSubjectId] = useState("");


  const getAllSubjects = async()=>{
    try {
        const token = localStorage.getItem("token"); 
        console.log("token from client Side : "+token);
        console.log("batchId from client Side : "+batchId);
        const response = await axiosInstance.get("/get-allSubjects/"+batchId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });


        console.log("Batch Data client side :", JSON.stringify(allBatch, null, 2));
        if(response.data && response.data.subjectData){
            const subjectsData = response.data.subjectData.flatMap(batch => batch.subjects);
            setAllBatch(subjectsData);
            console.log("Subjects Data array from client model : "+JSON.stringify(subjectsData, null, 2));
        }
    }catch(error) {
        console.log("An Unexpected Error from client side : "+error);
    }
  }



    const [subjects,setAllSubjects] = useState([]);
    const [courseNumber,setCourseNumber] = useState([]);

    const getSubjects = () => {
        const names = allBatch.map(subject => subject.courseName);
        const cono = allBatch.map(subject=>subject.coNo);
        setCourseNumber(cono);
        setAllSubjects(names);

    }

    useEffect(()=>{
        getAllSubjects()
        getSubjects()

    },[batchId]);

    const [Iat,setIat] = useState(["IAT 1","IAT 2","IAT 3"]);
    const [selectIat,setSelectIat] = useState("");

    const [openUpload,setOpenUpload] = useState(false);



    const generateExcel = () => {
        const data = [
          ["Name", "Age", "Score", "Total"],
          ["John", 25, 50, null],        
          ["Alice", 30, 80, null],
          ["Bob", 28, 70, null]
        ];
    
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        worksheet["D2"] = "C2+20"; 
        worksheet["D3"] = "C3+20"; 
        worksheet["D4"] = "C4+20";

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        workbook.Workbook = {
            CalcPr: {
              fullCalcOnLoad: true,
            },
        };

        XLSX.writeFile(workbook, "GeneratedExcel.xlsx");
      };

    const handleUpload = () => {
      setOpenUpload(false);
    }

  return (
    <>
      <div className='flex gap-4 items-center justify-between'>
        <div className='flex gap-2 items-center justify-center'>
          <h2 className='text-green-700'>Select batch</h2>
          <select className='w-50 border rounded p-2 -mt-1' value={batchId} onChange={(e)=>{setBatchId(e.target.value)}}>
            {
                allBatches.map(({_id,batchName})=> {
                    return <option value={_id}>{batchName}</option>
                })
            }
          </select>
        </div>

        <div className='flex gap-3'>
          <h2 className='text-green-700'>Select Subject</h2>
          {console.log("selected subject : "+subjectId)}
          <select className='w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto' value={subjectId} onChange={(e)=>{setSubjectId(e.target.value)}}>
              {
                  subjects.map((subject,idx)=> {
                      return <option value={idx}>{subject}</option>
                  })
              }
          </select>
        </div>
        <div className='flex gap-3'>
          <h2 className='text-green-700'>Select IAT</h2>
          <select className='w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto' value={selectIat} onChange={(e)=>{setSelectIat(e.target.value)}}>
              {
                  Iat.map((iat,idx)=> {
                      return <option value={idx}>{iat}</option>
                  })
              }
          </select>
        </div>

        <button className='flex items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium' onClick={(e)=>{setOpenUpload(true)}}>
          <IoMdCloudUpload />
          <h2>Upload</h2>
        </button>

        {
          openUpload && (
            <Modal 
              isOpen={openUpload}
              onRequestClose={()=>{}}
              ariaHideApp={false}
              style={
                  {
                      overlay:{
                          backgroundColor : "rgba(0,0,0,.2)",
                      },

                  }
              }
              contentlabel=""
              className="w-[30%] max-h-2/4 bg-white rounded-md mx-auto mt-40 p-5">
                <div className='flex flex-col p-1 gap-2'>
                  <div className='w-full flex items-center justify-between'>
                      <h2>Upload Excel</h2>
                      <button className='w-10 h-10 rounded-full flex items-center justify-center -mt-2 hover:bg-slate-50' onClick={(e)=>{setOpenUpload(false)}}>
                          <MdClose className="text-xl text-slate-400"/>
                      </button>
                  </div>
                  <div className='flex items-center justify-center w-full ml-5 mt-4'>
                    <input type="file" accept=".xlsx, .xls" className="mb-4 " onChange={(e)=>{handleUpload()}}/>
                  </div>

                  <p className='text-red-500 text-sm'>Please ensure that uploaded excel is in the required format</p>
                </div>
            </Modal>
          )
        }



        <button className='flex items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium'>
          <MdOutlineCreateNewFolder className='text-lg'/>
          <h2>generate</h2>
        </button>
          
      </div>
    </>
  );
}

export default DataEntry;
