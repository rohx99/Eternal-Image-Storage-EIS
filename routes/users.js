const mongoose = require("mongoose");
const plm = require ("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/EIS-Database").then(()=>{
    console.log("EIS Database Connected")
}).catch((e)=>{
    console.log(e)
    console.log("EIS Database not connected")
})

const userschema = mongoose.Schema(
  {
    fullname : {
      type : String,
      require : true,
    },
    username : {
      type : String,
      require : true,
      unique : true
    },
    password : {
      type : String,
    },
    post : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Post',
    }],
    profileImage : {
      type : String,
    },
    email : {
      type : String,
      require : true,
      unique : true,
    },
    boards : {
      type : Array,
      default : []
    },
  }
);

userschema.plugin(plm);

module.exports = mongoose.model("users" , userschema);
