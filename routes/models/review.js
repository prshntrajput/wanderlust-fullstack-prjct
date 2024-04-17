const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');

const Schema = mongoose.Schema;

const reviewSchema = Schema({
    comment:{type:String},

    rating:{type:Number,
    min:1,
max:5},

createdAt:{type:Date,
default:Date.now()}

})

module.exports= mongoose.model("Review",reviewSchema);