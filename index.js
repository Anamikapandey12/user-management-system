const { faker } = require('@faker-js/faker');
const express=require("express");
const app=express();
const path=require("path");
const bcrypt = require("bcrypt");

const methodOverride = require("method-override");
app.set("view engine","ejs")

app.set("views",path.join(__dirname,"/views"))
const mysql = require('mysql2');
const { fork } = require('child_process');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Soni1982'
});


app.get("/",(req,res)=>{
  let q=`SELECT count(*) FROM user`;
  connection.query(q,(err,result)=>{
  if(err) {
   console.error(err);
    res.send("some error occured");
   return;
  }
  let count=result[0]["count(*)"];
  res.render("home.ejs",{count});


  
});
});

app.get("/user",(req,res)=>{
  let q=`SELECT* FROM user`;
  connection.query(q,(err,users)=>{
  if(err) {
   console.error(err);
  res.send("some error occured");
   return;
  }
   console.log(users);
  // res.send(result);
  res.render("showusers.ejs",{users});

  
});
    
});

app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT* FROM user WHERE id='${id}'`;
  
  connection.query(q,(err,result)=>{
  if(err) {
   console.error(err);
  res.send("some error occured");
   return;
  }
  let user=result[0];
 
  res.render("edit.ejs",{user});

  
});
  
});
app.patch("/user/:id",(req,res)=>{
 
  let {id}=req.params;
  let{password:formPass, username:newUserName}=req.body;
  let q=`SELECT* FROM user WHERE id='${id}'`;
  
  connection.query(q,(err,result)=>{
  if(err) {
   console.error(err);
  res.send("some error occured");
   return;
  }
  let user=result[0];
  if(formPass!=user.password){
    res.send("worng password");
  }
  else{
    let q2=`UPDATE user SET username='${newUserName}' WHERE id='${id}'`;
    
connection.query(q2,(err,result)=>{
  if(err) {
   console.error(err);
   return;
  }
  res.redirect("/user");
  
});

  }
 


  
});
  

})


app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user", async(req, res) => {
  
  try{
  let {  username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  let q = `
    INSERT INTO user (username, email, password)
    VALUES (?, ?, ?)
  `;

  connection.query(q, [ username, email, hashedPassword], (err) => {
        if (err) {
      if (err.code === "ER_DUP_ENTRY") {
          return res.send("❌ Email already exists");
        }
        console.error(err);
        return res.send("❌ Database error");
    }
    res.redirect("/user");
  });
    } catch (error) {
    console.error(error);
    res.send("❌ Something went wrong");
  }

});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});


app.post("/login", (req, res) => {
  let { email, password } = req.body;

  let q = "SELECT * FROM user WHERE email = ?";

  connection.query(q, [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.send("Database error");
    }

    if (result.length === 0) {
      return res.send("User not found");
    }

    let user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
  res.redirect("/dashboard");
}
else {
      res.send("❌ Incorrect password");
    }
  });
});
app.get("/dashboard", (req, res) => {
  let q = "SELECT COUNT(*) AS total FROM user";

  connection.query(q, (err, result) => {
    if (err) return res.send("DB error");

    res.render("dashboard.ejs", {
      totalUsers: result[0].total
    });
  });
});

app.get("/user/search", (req, res) => {
  let { username } = req.query;

  let q;
  let values;

  if (!username) {
    q = "SELECT * FROM user";
    values = [];
  } else {
    q = "SELECT * FROM user WHERE username LIKE ?";
    values = [`%${username}%`];
  }

  connection.query(q, values, (err, users) => {
    if (err) return res.send("DB error");
    res.render("showusers.ejs", { users });
  });
});



app.listen("8080",()=>{
  console.log("app is listening on the port 8080");
  
});
// inserting new users

// let q="INSERT INTO user (id,username,email,password) VALUES ?";
// let data=[];
// for(let i=0;i<=100;i++){
//   data.push(getRandomUser());
  
// }



// connection.query(q,[data],(err,result)=>{
//   if(err) {
//    console.error(err);
//    return;
//   }
//   console.log(result);
  
// });
// connection.end();










// let getRandomUser =()=> {
//   return [
//      faker.string.uuid(),
//      faker.internet.username(),
//      faker.internet.email(),
    
//    faker.internet.password()
   
   
//   ];
// };

  





