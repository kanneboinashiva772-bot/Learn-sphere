const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const db=require("../db");
const {auth,SECRET}=require("../middleware/auth");

router.post("/register",async(req,res)=>{
 const name=String(req.body.name||"").trim();
 const email=String(req.body.email||"").trim().toLowerCase();
 const password=String(req.body.password||"");
 const role=req.body.role;
 if(name.length<2||name.length>80||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<6||password.length>100||!["student","instructor"].includes(role))
  return res.status(400).json({error:"Enter valid details. Password must be at least 6 characters."});
 try{
  const hash=await bcrypt.hash(password,12);
  db.prepare("INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)").run(name,email,hash,role);
  res.status(201).json({message:"Registration successful"});
 }catch(e){res.status(409).json({error:"Email already registered"});}
});

router.post("/login",async(req,res)=>{
 const email=String(req.body.email||"").trim().toLowerCase();
 const password=String(req.body.password||"");
 const user=db.prepare("SELECT * FROM users WHERE email=?").get(email);
 if(!user||!(await bcrypt.compare(password,user.password_hash))) return res.status(401).json({error:"Invalid email or password"});
 const token=jwt.sign({id:user.id,role:user.role},SECRET,{expiresIn:"2h"});
 res.cookie("token",token,{httpOnly:true,sameSite:"lax",secure:false,maxAge:7200000});
 res.json({user:{id:user.id,name:user.name,email:user.email,role:user.role}});
});

router.post("/logout",(req,res)=>{
 res.clearCookie("token",{httpOnly:true,sameSite:"lax",secure:false});
 res.json({message:"Logged out"});
});

router.get("/me",auth,(req,res)=>res.json({user:req.user}));
module.exports=router;
