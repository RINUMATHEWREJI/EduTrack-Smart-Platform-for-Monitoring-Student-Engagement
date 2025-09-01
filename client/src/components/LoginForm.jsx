import { useState } from "react";
import axios from 'axios';
import { setTokens } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;
function LoginForm({onLogin}){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");

    const handleForm = async (e)=>{
        e.preventDefault();

        try {
            const res = await axios.post(`${API_URL}login/`, { email, password });
            setTokens(res.data.access, res.data.refresh);
            onLogin(res.data.user);
        } 
        catch (err) {
            if (err.response && err.response.status === 400) {
            setError("Invalid email or password");
        } else {
            setError("Something went wrong. Please try again.");
        }
        }
    }

    return(
        <>
        <div className="loginform" >
            <form onSubmit={handleForm}>
                <input type="email" value={email} placeholder="Email" onChange={(e)=>setEmail(e.target.value)} className="border p-2"/>
                <input type="password" value={password} placeholder="password" onChange={(e)=>setPassword(e.target.value)} className="border p-2"/>
                <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>

        </>
    )
}

export default LoginForm