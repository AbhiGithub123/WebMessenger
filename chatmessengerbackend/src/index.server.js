const express=require('express');
const env=require('dotenv');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const path=require('path');


//routes
const authRoutes=require('./routes/auth');
const conversationRoutes=require('./routes/Conversations');
const messageRoutes=require('./routes/Message');





//environment variable or you can say constants
env.config();

//mongodb connection
//mongodb+srv://root:<password>@cluster0.nl3gd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.nl3gd.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, 
    {
        useNewUrlParser: true, useUnifiedTopology: true
    }
  ).then(()=>{
        console.log('Database connected')
  });

app.use(express.json());
app.use(cors());
app.use('/public',express.static(path.join(__dirname,'uploads')));
app.use('/api',authRoutes);
app.use('/api/conversations',conversationRoutes);
app.use('/api/messages',messageRoutes);




app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
});