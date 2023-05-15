const express=require('express');
const { protect } = require('../middlewares/authMiddlewares');
const {accessChat,fetchChat,createGroupChat, renameGroup,removeFromGroup,addToGroup} = require('../controllers/chatControllers');

const router=express.Router();
router.post('/',protect,accessChat);
router.get('/',protect,fetchChat);

router.post('/group',protect,createGroupChat);
router.put('/rename',protect,renameGroup);
router.put('/groupremove',protect,removeFromGroup);
router.put('/groupadd',protect,addToGroup);

module.exports=router;