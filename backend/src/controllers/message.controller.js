import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async(req , res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password")    //This will give all the users whose id are not equal to the loggedInUserId.

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsersForSidebar:", error.message);
        res.status(500).json({message: "Internal Server Error"})
        
    }
}

export const getMessages = async(req,res) => {
    try {
        const {id:userToChatId} = req.params     //Gets the Id of the user on which we have clicked.
        const myId = req.user._id                         //Gets my Id.

        const messages = await Message.find({                 //Finding all the messages which are either sent by me or received by me.
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId: userToChatId, receiverId:myId}
            ]
        });

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const sendMessage = async(req,res) => {
    try {
        const {text, image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        //Creating a new message:
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);

        //If receiverSocketId existed , this means that the user is online and then we are emitting the newMessage to his receiverSocketId.
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);   //Sending the newMessage back to the client

    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({message:"Internal server error"});
        
    }
}