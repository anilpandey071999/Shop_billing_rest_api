// Contains all the in-built libraries that are accessed.
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdf-creator-node');
var fs = require("fs");
const { json } = require('body-parser');
const mysql = require('mysql');
// const {inspect } from Uint/;

var utile = require('util');




router.post('/',(req,res,next)=>{
  
  //Reading the data from the url
  var product = req.body.Product;
  var price = req.body.Price;
  var quantity = req.body.Quantity;
  var billNo = req.body.billNo;
  var name = req.body.name;
  var email  = req.body.email;
  var phone = req.body.phone;

  var user;
  var users=[];
  var total = 0;
  var Totals = 0;
  var anvalTotal = 0;

  var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"nodedb"
  })
  
  con.connect(function(err){
    if(err) throw err;
      console.log("successfully Connect");
      con.query("CREATE database IF NOT EXISTS NODEDB",function(err,result){
      if(err) throw err;
      console.log("Database created");
    })
  })

  
  var sql = "Insert into `billdata`( `name`, `email`, `phone`, `time`, `billno`) values ('"+name+"','"+email+"','"+phone+"',"+null+",'"+billNo+"')";
  con.query(sql,function(err,result){
    if(err) throw err;
    console.log(result);
  });

  var sql = "Insert into `product`(`billno`,`Product`,`Quantity`,`Price`) values ?";
  var valuse = [];
  var val;
  for(var i = 0;i<price.length;i++){
    val = [billNo,product[i],quantity[i],price[i]]
    valuse.push(val)
  }
console.log(valuse);
con.query(sql,[valuse],function(err,result){
  if(err) throw err;
  console.log(result);
})


  
  var html = fs.readFileSync('./template.html','utf-8');
  
  var options = { 
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Author: Anil Pandey</div>'
    },
    "footer": {
        "height": "28mm",
        "contents": {
        first: 'Cover page',
        2: 'Second page', // Any page number is working. 1-based index
        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page'
    }
  }
};


for(let i =0 ;i<price.length;i++ ){
  total = price[i]*quantity[i];
  Totals =Totals+total;
  if(i==price.length-1){
     anvalTotal= Totals;
     console.log(anvalTotal);
  }else{
    console.log(i);
  }
  if(anvalTotal== 0){
    user ={
      no:i+1,
      product: product[i],
      price:price[i],
      quantity:quantity[i],
      total:total
      };
  }else{
    user ={
      billNo:billNo,
      name:name,
      email:email,
      phone:phone,
      no:i+1,
      product: product[i],
      price:price[i],
      quantity:quantity[i],
      total:total,
      anvalTotal:Totals
    };
    }
 
 
 console.log(user);
users.push(user);
}

// console.log(userData);

// users.push({"no":"1"})
console.log("-------------");
console.log(utile.inspect(users));

var document = {
  html: html,
  data: {
      users: users,
      // user:userData
  },
  path: "./"+billNo+".pdf"
};

PDFDocument.create(document, options)
    .then(res => {
        console.log(res)
    })
    .catch(error => {
        console.error(error)
        next(error);
    });
    // res.send(users);
    res.send({status:200,message:'PDF Created Successfully'})
    // res.redirect('output.pdf');
});

module.exports = router;