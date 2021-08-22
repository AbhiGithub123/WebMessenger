const express=require('express');
const { requireSignin } = require('../common-middlewares');
const { signup,signin, signout, getUserById, addPicture} = require('../controller/auth');
const { validateSigninRequest, isRequestValidated, validateSignupRequest } = require('../Validators/auth');
const router=express.Router();
const multer=require('multer');
const shortid=require('shortid');
const path=require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() +'-'+ file.originalname)
    }
  })

const upload=multer({storage});

router.post('/signin',validateSigninRequest,isRequestValidated,signin);

router.post('/signup',validateSignupRequest,isRequestValidated,signup);

router.post('/signout',signout);

//get User

router.get('/users',getUserById);

//profile picture api
router.post('/profile',requireSignin,upload.single('profilePicture'),addPicture);



module.exports=router;