const asyncHandler=require('express-async-handler');
const Chat = require("../models/chatModels.js");
const User = require("../models/userModels.js");
const Message=require('../models/MessageModels.js');
const sendMessage=asyncHandler(async(req,res)=>{
    console.log('body',req.body);
    const {content,chatId}=req.body;
    if(!content||!chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    // console.log('new message ',newMessage);
    try{
        var message = await Message.create(newMessage);
        console.log('message',message);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });
        console.log('message',message);
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        res.json(message);
    }
    catch(err){
        res.status(400);
        throw new Error(err.message);

    }
});

const allMessages=asyncHandler(async (req,res)=>{
    try{
        const messages=await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat");
        res.json(messages);
    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
})
module.exports={sendMessage,allMessages}