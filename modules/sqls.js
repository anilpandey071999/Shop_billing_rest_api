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