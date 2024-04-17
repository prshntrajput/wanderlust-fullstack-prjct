const mongoose = require("mongoose");
const listings = require("../models/listing");
const initData = require("./data");
const express=require("express");

mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');



const initDB = async function(){
    await listings.deleteMany();
    await listings.insertMany(initData.data);
    console.log("data was initialized")
}
initDB();
