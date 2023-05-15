import React from 'react'
import {ChatState} from '../Context/ChatContext'
import {Box} from '@chakra-ui/react';
import MyChats from '../MyChats';
import ChatBox from '../ChatBox';
import SideDrawer from '../miscellaneous/SideDrawer';
import {useState} from 'react';
const Chats = () => {

    const {user} = ChatState();
    const [fetchAgain, setFetchAgain] = useState();
    console.log(user);
    return (
        <div style={
            {width: "100%"}
        }>
            {
            user && <SideDrawer/>
        }
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {
                user && <MyChats fetchAgain={fetchAgain}/>
            }
                {
                user && <ChatBox fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}/>
            } </Box>
        </div>
    )
}

export default Chats
