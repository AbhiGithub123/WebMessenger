const express=require('express');
const { addMessage, getMessage } = require('../controller/Message');
const router=express.Router();

//add
router.post("/",addMessage);


//get
router.get("/:conversationId",getMessage)




module.exports=router;

