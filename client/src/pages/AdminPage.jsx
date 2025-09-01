import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function AdminPage(){

    const navigate = useNavigate();

    return(
        <>
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={()=>{logout(); navigate("/"); }} >Logout</button>
        </div>
        </>
    )
}

export default AdminPage