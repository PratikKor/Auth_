import { create } from "zustand";
import axios from "axios";
// import { error } from "console";

const api_url = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,
    message:null,


    signup :async(email,password,name) => {
        set({isLoading:true,error:null});
        try {
            const response = await axios.post(`${api_url}/signup`,{email,password,name});
            set({user:response.data.user,isAuthenticated:true,isLoading:false});
        } catch (error) {
            set({error:error.response.data.message || "Error Signing Up",isLoading:false});
            throw error;
        }
    },

    login :async(email,password) => {
        set({isLoading:true,error:null});
        try {
            const response = await axios.post(`${api_url}/login`,{email,password});
            set({
                isAuthenticated:true,
                user:response.data.user,
                error:null,
                isLoading:false
            });
        } catch (error) {
            set({error:error.response?.data?.message || "Error Logging Up",isLoading:false});
            throw error;
        }
    },

    logout :async() => {
        set({isLoading:true,error:null});
        try {
            await axios.post(`${api_url}/logout`);
            set({
                user:null,
                isAuthenticated:false,
                error:null,
                isLoading:false
            });
        } catch (error) {
            set({error:"Error Logging Out",isLoading:false});
            throw error;
        }
    },

    verifyEmail: async (code)=>{
        set({isLoading:true,error:null});
        try {
            const response = await axios.post(`${api_url}/verify-email`,{code});
            set({user:response.data.user,isAuthenticated:true,isLoading:false});
        } catch (error) {
            set({error:error.response.data.message || "Error Verifying Email",isLoading:false});
            throw error;
        }
    },

    checkAuth : async () => {
        set({isCheckingAuth:true,error:null});
        try {
            const response = await axios.get(`${api_url}/check-auth`);
            set({user:response.data.user , isAuthenticated:true ,isCheckingAuth:false,});
        } catch (error) {
            set({error:null , isCheckingAuth:false,isAuthenticated:false});
        }
    },

    forgotPassword:async (email) => {
        set({isLoading:true,error:null});
        try {
            const response = await axios.post(`${api_url}/forgot-password`,{email});
            set({
                message:response.data.message,
                isLoading:false
            });
        } catch (error) {
            set({isLoading:false,
                error:error.message.data.message || "Error sending email for password reset" , 
            });
            throw error;
        }
    },

    resetPassword: async (token,password) => {
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${api_url}/reset-password/${token}`,{password})
            set({message:response.data.message ,isLoading:false});
        } catch (error) {
            set({
                isLoading:false,
                error:error.response.data.message || "Error resetting Password",
            });
            throw error;
        }
    }


}))