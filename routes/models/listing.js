const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');

const Schema = mongoose.Schema;

const listingSchema = Schema({
  title:{type:String,
    required:true,
},
  description:{type:String
  },
  image:{
    default:"https://images.unsplash.com/photo-1699084681511-8cc4306de721?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type:String,
    set:(v)=> v===""? "https://images.unsplash.com/photo-1699084681511-8cc4306de721?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v,
  },
  price:Number
  ,
  location:String
,
  country:String,
  review:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  }]
});

module.exports = mongoose.model("Listing",listingSchema);