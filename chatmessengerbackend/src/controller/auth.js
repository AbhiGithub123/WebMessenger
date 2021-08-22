const User=require('../models/user');
const shortid=require('shortid');
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');


const generateJwtToken = (_id) => {
    return jwt.sign({ _id}, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  };

exports.signup=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec(async (error,user)=>{
        if(user)
        {
            return res.status(400).json({
                message: 'User already registered'
            })
        }
        const {
            firstName,
            lastName,
            email,
            password
        }=req.body;
        const hash_password=await bcrypt.hash(password,10);
        const _user=new User({
            firstName,
            lastName,
            email,
            hash_password,
            username:shortid.generate()
        })

        _user.save((error,user)=>{
             if(error){
                 return res.status(400).json({
                     message:'Something went wrong'
                 })
             }
             if(user)
             {
                const token = generateJwtToken(user._id);
                const { _id, firstName, lastName, email, fullName } = user;
                return res.status(201).json({
                  token,
                  user: { _id, firstName, lastName, email,fullName },
                });
             }
        })
    })
}

exports.signin=(req,res)=>{

    User.findOne({email:req.body.email})
    .exec(async (error,user)=>{
          if(error) return res.status(400).json({error});
          if (user) {
            const isPassword = await user.authenticate(req.body.password);
            if (isPassword) {
              
              const token = generateJwtToken(user._id);
              const { _id, firstName, lastName, email, fullName } = user;
              res.cookie("token", token, { expiresIn: "1d" });
              res.status(200).json({
                token,
                user: { _id, firstName, lastName, email, fullName },
              });
            } else {
              return res.status(400).json({
                message: "Something went wrong",
              });
            }
          } else {
            return res.status(400).json({ message: "Something went wrong" });
          }
    })

}

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};

exports.getUserById=async (req,res)=>{
  const userId=req.query.userId;
  try
  {
    const user=await User.findById(userId);
    const {firstName, lastName, email}=user;
    res.status(200).json({firstName, lastName, email});
  }
  catch(err)
  {
  res.status(500).json({err});
  }
}

exports.addPicture=async (req,res)=>{

  if(req.file)
  {
   userProfile=process.env.API+'/public/'+ req.file.filename;
  }
  const userID=req.user._id;
  const updateProfile={profilePicture:userProfile}
  try
  {
    
    const userPicture=await User.findOneAndUpdate({_id:userID},updateProfile,{new :true});
    res.status(200).json({userPicture});
  }
  catch(err)
  {
    res.status(500).json({err});
  }

}
