const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userCredential = require('../modules/user');
const bodyparser = require('body-parser');
// const { json } = require('body-parser');
const createHttpError = require('http-errors');

routes.post('/',async(req,res,next)=>{
    const email = req.query.email;
    const password =await req.query.password;
    console.log(email);
    console.log(password);

    try {
        const user_Data = await userCredential.find({userName:email},{__v:0,_id:0})
        // const com_pass=user_Data.Password;
        console.log(Array.isArray(user_Data));
        // res.send(user_Data);
        // for(var i = user_Data.length-1;i<user_Data.length;i++){
            console.log(user_Data);
            
            if(Array.isArray(user_Data)==true){
                console.log("in array chacking");
                const com_pass=user_Data[0].Password;
            if(bcrypt.compareSync(password,user_Data[0].Password)){
                console.log("comparing")
                console.log(password);
                console.log(com_pass);
                res.send({status:200,message:"Welcome"});
            }else{
                res.send("incurrect password");
            }
            }else{
                throw createHttpError(404,'User not found');
                // res.send({status:404,message:"User not found"})
            }
        // } 
    }catch (error) {
        console.log(error.message);
        next(error);
    }
})

module.exports = routes;