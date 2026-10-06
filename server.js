require("dotenv").config();
const express=require("express");
const path=require("path");
const helmet=require("helmet");
const cookieParser=require("cookie-parser");
const rateLimit=require("express-rate-limit");
require("./db");

const app=express();
const PORT=Number(process.env.PORT)||3000;

app.disable("x-powered-by");
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"100kb"}));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/api/",rateLimit({
  windowMs:15*60*1000,
  max:300,
  standardHeaders:true,
  legacyHeaders:false
}));

app.use("/api/auth",require("./routes/auth"));
app.use("/api/courses",require("./routes/courses"));
app.use("/api/quizzes",require("./routes/quizzes"));
app.use("/api/results",require("./routes/results"));

app.get("/api/health",(req,res)=>res.json({ok:true}));

app.use(express.static(path.join(__dirname,"public")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));

app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).json({error:"Server error"});
});

app.listen(PORT,()=>console.log(`LearnSphere running at http://localhost:${PORT}`));
