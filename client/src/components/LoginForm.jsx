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
            setTokens(res.data.access,res.data.refresh,res.data.user);
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

     return (
    <div className="login-container">
      <form onSubmit={handleForm} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default LoginForm