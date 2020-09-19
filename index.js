const express = require('express');
const mongoos = require('mongoose');
const mysql = require('mysql');
const http = require('http');
const fs = require('fs');


const userCredential = require('./modules/user');

// mongoos.connect('mongodb+srv://ShadowWalker:Anil@07@cluster0-dgxg1.mongodb.net/SampleAPI',
// {
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }).then(()=>{
//     console.log('connected to the Mongodb Server');
// })

// mongoos.connection.on('connected',()=>{
//     console.log("mongoose is connected to db");
// })

// mongoos.connection.on('error',(err)=>{
//     console.log(err.meassage);
// })

// mongoos.connection.on('disconnection',()=>{
//     console.log('mongoose is disconnected...');
// })

const app = express();

const createError = require('http-errors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');


const  login = require('./route/login');
const genPDF = require('./route/genPDF');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/Login',login);
app.use('/pdf',genPDF);
app.get('/pdfs/:name',(req,res)=>{

        var pdfname = req.params.name;
    console.log(".....");
    console.log(pdfname);
var file = fs.createReadStream('./'+pdfname+".pdf");
var stat = fs.statSync('./'+pdfname+".pdf");
res.setHeader('Content-Length', stat.size);
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
file.pipe(res);
    
})
app.get('/',(req,res)=>{
    // res.writeHead(200);
    if (req.url === '/') req.url = '/index.html'; // courtesy of @JosephCho
    res.end(fs.readFileSync(__dirname + req.url));
})
// const userCredential = require('../modules/user');
app.post('/',async(req,res,next)=>{
        const userName = req.body.userName;
        const userPassword = req.body.userPassword;
       
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(userPassword,salt);

        console.log(hash);
        // console.log(decrypted);
    
        var data = {
            "userName": userName,
            "Password":hash
        }
        try {
            
            // const storeData = data
            const result = await userCredential(data).save();
            res.send(result); 
        } catch (error) {
            next(error);
        }
})




app.use((req,res,next)=>{
    next(createError(404,'Not Found'));
});

app.use((err,req,res,next)=>{
    res.status(err.status||500);
    res.send({
        error:{
            status:err.status||500,
            message:err.message 
        }
    })
})

app.use(morgan('dev'));

app.listen(300,()=>{
    console.log('Server is Listen on port 300')
})

