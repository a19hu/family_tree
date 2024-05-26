const mongoose = require("mongoose");

const ConnectDB =async() =>{
   
  try{
      
     const connect = await mongoose.connect(process.env.MONGO_URI,{

     });
     console.log(`MongoDB Connected: ${connect.connection.host}`)
  }catch(err){
    console.log(err);
  }
}

module.exports = ConnectDB;