import React, { useState } from 'react'
import PasswordInput from '../../components/Inputs/PasswordInput'
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");

    const navigate = useNavigate();

    const handleSignUp = async(e) => {
        e.preventDefault();

        if(!validateEmail(email)) {
            setError("Please Enter Valid Email Address");
            return;
        }

        if(!name) {
            setError("Please Enter The User Name");
            return;
        }

        if(!password) {
            setError("Please Enter The Password");
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post("/create-user",{
                fullName : name,
                email : email,
                password : password
            });

            if(response.data && response.data.error) {
                setError(response.data.message);
                return;
             }
 
             if(response.data && response.data.accessToken) {
                 localStorage.setItem("token",response.data.accesstoken);
                 navigate("/dashboard");
             }

        }catch(error) {
            if(error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }else {
                setError("An unexpected error occured Please try again");
            }
        }


    }


  return (
        <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleSignUp}>
                        <h4 className="text-2xl mb-7">SignUp</h4>

                        <input type="text" placeholder="User Name" className="input-box" 
                        value={name} onChange={(e)=>{setName(e.target.value)}}
                        />

                        <input type="text" placeholder="Email" className="input-box" 
                        value={email} onChange={(e)=>{setEmail(e.target.value)}}
                        />

                        <PasswordInput value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                        {error && <p className="text-red-500 text-x5 pd-1">{error}</p>}  

                        <button className="btn-primary">
                            Create Account
                        </button>

                        <p className="text-sm text-center mt-4">
                            Already Have an Account?{" "}
                            <Link to="/login" className="font-medium text-primary underline">Login With Your Account</Link>
                        </p>
                    </form>
                </div> 
        </div>
  )
}

export default SignUp;