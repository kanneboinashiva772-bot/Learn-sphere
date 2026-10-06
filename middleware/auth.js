const jwt=require("jsonwebtoken");
const db=require("../db");
const SECRET=process.env.JWT_SECRET||"dev-secret-change-me";

function auth(req,res,next){
 const token=req.cookies.token;
 if(!token) return res.status(401).json({error:"Please login"});
 try{
  const p=jwt.verify(token,SECRET);
  const user=db.prepare("SELECT id,name,email,role FROM users WHERE id=?").get(p.id);
  if(!user) return res.status(401).json({error:"Invalid session"});
  req.user=user; next();
 }catch(e){return res.status(401).json({error:"Session expired. Login again."});}
}
function role(...roles){
 return (req,res,next)=>{
  if(!roles.includes(req.user?.role)) return res.status(403).json({error:"Access denied"});
  next();
 };
}
module.exports={auth,role,SECRET};
