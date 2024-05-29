const mongoose = require("mongoose");

const ConnectDB =async() =>{
   
  try{
      
    const connect = await mongoose.connect('mongodb+srv://a19hu:a19hu20osh@cluster0.iuomioz.mongodb.net/',{

     });
     console.log(`MongoDB Connected: ${connect.connection.host}`)
  }catch(err){
    console.log(err);
  }
}

module.exports = ConnectDB;