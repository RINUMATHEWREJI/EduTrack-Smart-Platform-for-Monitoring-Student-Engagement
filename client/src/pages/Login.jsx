import LoginForm from "../components/LoginForm";
import {useNavigate} from "react-router-dom";
function Login(){

    const navigate = useNavigate();

    const handleLogin = (user)=>{   
        if (user.role == "TEACHER"){
            navigate("/teacher");
        }
        else if (user.role == "STUDENT"){
            navigate("/student");
        }
        else if(user.role == "SUPERADMIN"){
            navigate("/admin");
        }
    };
    return(
        <>
        <div className="flex justify-center items-center h-screen">
            <LoginForm onLogin={handleLogin} />
        </div>
        </>
    )
}

export default Login