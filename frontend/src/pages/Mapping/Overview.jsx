import React, { useEffect, useState } from 'react'
import { IoIosAddCircle } from "react-icons/io";
import { Link } from 'react-router-dom';
import Modal from "react-modal";
import AddBatchCard from '../../components/cards/AddBatchCard';
import axiosInstance from '../../utils/axiosInstance';

const Overview = () => {

   
    const [openBatch,setOpenBatch] = useState(false);
    const [allBatches,setAllBatches] = useState([]);

    const [selectBatch,setSelectBatch] = useState("");
    const [batchData,setBatchData] = useState([]);

    const getAllBatch = async () => {
        try {
            const response = await axiosInstance.get("/get-all-batches");

            if(response.data && response.data.batches) {
                console.log(response.data.batches);
                setAllBatches(response.data.batches);
            }
        }catch(error) {
            console.log("An Unexpected Error");
        }
    }

    console.log(axiosInstance.defaults.baseURL + `/get-sem/${encodeURIComponent(selectBatch)}`);

    // const getSemData = async() => {
    //     try {
    //         const response = await axiosInstance.get(`/get-sem/${encodeURIComponent(selectBatch)}`);
    //         if(response.data && response.data.batchData) {
    //             setBatchData(response.data.batchData);
    //         }

    //     }catch(error) {
    //         console.log("An Unexpected Error : "+error);
    //     }
    // }

    useEffect(()=>{
        getAllBatch()
        if (selectBatch) {
            // getSemData()
        }
        // console.log("batchData : " + batchData);
    },[],selectBatch);


  return (
    <div className='flex flex-col p-3 justify-between w-full h-full'>
        <div className='flex items-center justify-between w-full'>
            <div className='flex gap-3'>
                <h2 className='text-green-700'>Select batch</h2>
                <select className='w-50 border rounded p-2 -mt-2' value={selectBatch} onChange={(e)=>{setSelectBatch(e.target.value)}}>
                    {
                        allBatches.map(({_id,batchName})=> {
                            return <option value={_id}>{batchName}</option>
                        })
                    }
                </select>
                <button className='-mt-2 w-30' onClick={()=>setOpenBatch(true)}>
                    <IoIosAddCircle className='text-lg text-slate-500'/>
                </button>
                
                <Modal 
                    isOpen={openBatch}
                    onRequestClose={()=>{}}
                    style={
                        {
                            overlay:{
                                backgroundColor : "rgba(0,0,0,.2)",
                            },

                        }
                    }
                    contentlabel=""
                    className="w-[30%] max-h-3/4 bg-white rounded-md mx-auto mt-36 p-5">
                        <AddBatchCard
                            type="batch"
                            onClose={()=>{setOpenBatch(false)}}
                            getAllBatch={getAllBatch}
                        />
                </Modal>                
            </div>

            <Link className='flex bg-green-600 p-2 text-white items-center gap-3 rounded' to="/dashboard/addSem" state={{batchId : selectBatch}}>
                <h2>Add </h2>
                <IoIosAddCircle className='text-lg text-white'/>
            </Link>
        </div>
        <div className='mt-5 flex flex-col gap-5 '>
            <p className='bg-gray-300 p-2 w-20 rounded font-medium'>Sem 1</p>
            <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md overflow-hidden table-fixed">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">co.no</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Course code</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">course Name</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">staff Name</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">status</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">category</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">L</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">T</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">P</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">C</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {
                            (batchData.subjects && batchData.subjects.map(({courseCode,courseName,staffName,status,category,L,T,P,C})=>{
                                return (
                                    <tr className="hover:bg-gray-100 border-b border-gray-200">
                                        <td className="w-1/4 px-6 py-4">{courseCode}</td>
                                        <td className="w-1/4 px-6 py-4">{courseName}</td>
                                        <td className="w-1/4 px-6 py-4">{staffName}</td>
                                        <td className="w-1/4 px-6 py-4">{status}</td>
                                        <td className="w-1/4 px-6 py-4">{category}</td>
                                        <td className="w-1/4 px-6 py-4">{L}</td>
                                        <td className="w-1/4 px-6 py-4">{T}</td>
                                        <td className="w-1/4 px-6 py-4">{P}</td>
                                        <td className="w-1/4 px-6 py-4">{C}</td>
                                    </tr>
                                );
                            }))
                        }
                    </tbody>
                    
            </table>
        </div>
        <div>
            // final result button column
        </div>
    </div>
  )
}

export default Overview;
