import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ()=>{
    const {messages,getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);
    
    useEffect(() =>{
        getMessages(selectedUser._id);
        subscribeToMessages();
        return () => unsubscribeFromMessages()
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);


    //UseEffect for auto scrolling down whenever a new message is received.
    useEffect(()=>{
        if(messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    if(isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <MessageSkeleton/>
            <MessageInput/>
        </div>
    )

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (

                    // For sender it shows chat-end design of the message box otherwise it shows chat-start design of the message box.

                    <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} `} ref={messageEndRef}>
                        <div className="chat-image avatar">

                            {/* Shows the profile pic of the sender and the receiver.  */}
                            <div className="size-10 rounded-full border">
                                <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                                alt="profile pic" />
                            </div>
                        </div>

                        {/* Shows the time of the message in the chat  */}
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                    
                    {/* This is the design of the background of the message sent.  */}
                        <div className={`chat-bubble flex flex-col ${message.senderId === authUser._id ? "bg-primary text-primary-content" : ""}`}>
                        {message.image && (
                        <img
                            src={message.image}
                            alt="Attachment"
                            className="sm:max-w-[200px] rounded-md mb-2"
                        />
                        )}
                        {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput/>
        </div>
    )
};

export default ChatContainer;