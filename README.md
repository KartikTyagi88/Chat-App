# 💬 Real-Time Chat App

A full-stack real-time chat application built with **MongoDB, Express.js, React.js, and Node.js** (MERN). Features secure **JWT authentication**, **one-on-one messaging**, **image sharing**, **typing indicators**, and a **responsive UI**. Built with **Socket.io**, **Zustand**, and **Axios** for state management and API handling.

## 🚀 Features

- 🔐 **Secure Authentication** with JWT and bcrypt
- 💬 **Real-Time One-on-One Messaging** using Socket.io
- 🖼️ **Image Sharing** in chats
- ✍️ **Typing Indicators** for live user feedback
- 📱 **Responsive UI** optimized for all devices
- ⚙️ **State Management** using Zustand
- 📡 **API Requests** handled via Axios

## 🛠️ Tech Stack

- **Frontend**: React.js, Zustand, Axios, TailwindCSS
- **Backend**: Node.js, Express.js, Mongoose, Socket.io
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Database**: MongoDB
- **Cloud Media Management**: Cloudinary

## 📁 Project Structure

- ## backend/
- ├── src/
- │   ├── controllers/     
- │   ├── lib/             
- │   ├── middlewares/     
- │   ├── models/          
- │   ├── routes/          
- │   └── index.js         
- ├── .env                 
- ├── package.json         

###
###

- ## frontend/
- ├── public/              
- ├── src/
- │   ├── components/      
- │   ├── constants/       
- │   ├── lib/             
- │   ├── pages/           
- │   ├── store/           
- │   ├── App.jsx          
- │   ├── main.jsx         
- │   └── index.css        
- ├── vite.config.js       
- ├── package.json         


### Setup .env file

```js
MONGODB_URI=...
PORT=5001
JWT_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

NODE_ENV=development
```
