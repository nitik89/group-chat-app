const express = require('express');
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cors = require('cors');
const {notFound, errorHandler} = require('./middlewares/errorMiddlewares');
const app = express();


dotenv.config();
app.use(express.json()); // to accept json data
app.use(cors())
connectDB();
app.get("/", (req, res) => {
    res.send("API Running!");
});
const PORT = process.env.PORT;

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);
const server = app.listen(PORT, () => {
    console.log(`${PORT}`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
});
io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");

    })
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined the room: ", room);
    });
    socket.on('typing', (room) => socket. in (room).emit("typing"))
    socket.on('stop typing', (room) => socket. in (room).emit("stop typing"))
    socket.on('new message', (newMessageRecived) => {
        console.log('new message is here', newMessageRecived)
        var chat = newMessageRecived.chat;
        if (! chat.users) 
            return console.log("chat.users not defined");
        
        chat.users.forEach((user) => {
            if (user._id == newMessageRecived.sender._id) 
                return;
            
            socket. in (user._id).emit("message recieved", newMessageRecived);
        })
    })
    socket.off('setup', () => {
        console.log('USER DISCONNECTED');
        socket.leave(userData._id);
    })

})
