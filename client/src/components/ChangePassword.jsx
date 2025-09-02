import axios from "axios";
import { useState } from "react";
import { getAccessToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;
function ChangePassword(){

    const [oldpass,setOldpass] = useState("");
    const [newpass,setNewpass] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const changePass = async()=>{
        setMessage("");
        setError("");

        try{
            const res = await axios.put(`${API_URL}changepassword/`,
                {
                    old_password:oldpass,
                    new_password:newpass,
                },
                {
                    headers: { Authorization: `Bearer ${getAccessToken()}` },
                }
            );

            setMessage("password changed successfully!");
            setOldpass("");
            setNewpass("");
        }
        catch(error){
            console.log("error changing password: ",error);
            setError(
                error.response?.data?.old_password?.[0] ||
                error.response?.data?.new_password?.[0] ||
                "Failed to change password"
            );
        }

    }
    return(
        <>
        <div className="password-container">
            <label>
                Old Password:
                <input type="password" value={oldpass} onChange={(e)=>{setOldpass(e.target.value)}} />
            </label>
            <label>
                New Password:
                <input type="password" value={newpass} onChange={(e)=>{setNewpass(e.target.value)}} />
            </label>

            <button onClick={changePass}>Change Password</button>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
        </>
    )
}

export default ChangePassword