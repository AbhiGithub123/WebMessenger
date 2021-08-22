const express=require('express');
const { allConversations, getUserConversation } = require('../controller/Conversations');
const router=express.Router();


//new conversation

router.post("/",allConversations);

router.get('/:userId',getUserConversation)

module.exports=router;
