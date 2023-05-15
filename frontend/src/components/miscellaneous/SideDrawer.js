import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    Text,
    Tooltip,
    MenuItem,
    MenuDivider,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Input,
    Spinner
} from '@chakra-ui/react';
import React, {useContext, useState} from 'react'
import axios from 'axios';
import {useHistory} from "react-router-dom";
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons';
import {Avatar} from '@chakra-ui/react';
import {useToast} from "@chakra-ui/toast";
import {ChatState} from '../Context/ChatContext';
import Profile from './Profile';
import {useDisclosure} from '@chakra-ui/hooks'
import ChatLoading from '../ChatLoading';
import UserListItems from '../UserAvatar/UserListItems';
import { getSender } from '../config/ChatLogics';
import {Effect} from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    
    const {isOpen, onOpen, onClose} = useDisclosure();

    console.log(onOpen);
    const {user,setSelectedChat,chats,
        setChats,notification,setNotification} = ChatState();
    const history = useHistory();
    const toast = useToast();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    }
    const accessChat = async (userId) => {
        console.log(userId);
    
        try {
          setLoadingChat(true);
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(`/api/chat`, { userId }, config);
           console.log('data',data);
          if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
          setSelectedChat(data);
          setLoadingChat(false);
          onClose();
        } catch (error) {
          toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${
                        user.token
                    }`
                }
            };
            const {data} = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (err) {
            toast({
                title: "Error Occured!!",
                description: "Failed to load the search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }
    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost"
                        onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text d={
                                {
                                    base: "none",
                                    md: "flex"
                                }
                            }
                            px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Talk-A-Tive
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge count={notification?.length} effect={Effect.SCALE}/>
                            <BellIcon fontSize='2xl'
                                m={1}/>
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification?.length && "No new messages"}
                            {notification?.map(notif=>(
                                <MenuItem key={notif._id} onClick={()=>{
                                    setSelectedChat(notif.chat)
                                    setNotification(notification.filter((n)=>n!==notif))
                                }}>
                                    {notif.chat.isGroupChat?`New Message in ${notification.chat.chatName}`
                                    :`New Message from ${getSender(user,notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button}
                            rightIcon={<ChevronDownIcon/>}>
                            <Avatar size='sm' cursor='pointer'
                                name={
                                    user.name
                                }
                                src={
                                    user.pic
                                }/>
                        </MenuButton>
                        <MenuList>
                            <Profile user={user}>
                                <MenuItem>
                                    MyProfile
                                </MenuItem>
                            </Profile>
                            <MenuDivider/>
                            <MenuItem onClick={logoutHandler}>
                                Logout
                            </MenuItem>

                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left'
                onClose={onClose}
                isOpen={isOpen}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex'
                            pb={2}>
                            <Input placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={
                                    (e) => {
                                        setSearch(e.target.value)
                                    }
                                }/>
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {
                        loading ? (
                            <><ChatLoading/></>
                        ) : (searchResult ?. map(user => (
                            <UserListItems key={
                                    user._id
                                }
                                user={user}
                                handleFunction={() => accessChat(user._id)}
                                />
                        )))
                        
                    } 
                    {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer
