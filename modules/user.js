const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const credential = new Schema({
    userName : {
        type:String,
        required:true
    },
    Password : {
        type:String,
        required:true
    }
})

const Credentials = mongoose.model('Credetial',credential);
module.exports = Credentials;