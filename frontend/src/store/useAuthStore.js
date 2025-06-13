import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

//useAuthStore will call create function, which has a callback function. This callback function returns an object (State).
export const useAuthStore = create((set, get)=>({
    authUser:null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket:null,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");    //Getting response from the /auth/check path to check if the user is authenticated or not. This req is sent using axios library.
            set({authUser:res.data})                                 //Setting the value of the state authUser as the response data.
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error.message);
            
            set({authUser:null})
        } finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async(data) =>{
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully!");

            get().connectSocket()

        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isSigningUp:false});
        }
    },

    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    login: async(data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isLoggingIn: false});
        }
    },

    updateProfile: async(data)=>{
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile");
            toast.error(error.response.data.message);
        } finally{
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;           //If a user is not authenticated or if the socket connection is already build, then return (No need to build a new socket connection)
        
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({socket:socket});

        socket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers: userIds});
        })
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }
}));