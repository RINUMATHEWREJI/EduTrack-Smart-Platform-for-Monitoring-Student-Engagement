import { jwtDecode } from "jwt-decode";


export const setTokens = (access,refresh)=>{
    localStorage.setItem("access",access);
    localStorage.setItem("refresh",refresh);
};

export const getAccessToken =()=> localStorage.getItem("access");

export const getUserFromToken=()=>{
    const token = getAccesstoken();
    if (!token) return null;
    try{
        return jwtDecode(token);
    }
    catch(error){
        return null;
    }
};

export const logout=()=>{
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
};