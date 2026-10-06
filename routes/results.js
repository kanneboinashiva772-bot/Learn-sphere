const router=require("express").Router();
const db=require("../db");
const {auth}=require("../middleware/auth");

router.post("/",auth,(req,res)=>{
 const courseId=Number(req.body.courseId),score=Number(req.body.score),total=Number(req.body.total);
 if(!Number.isInteger(courseId)||!Number.isInteger(score)||!Number.isInteger(total)||total<1||score<0||score>total)return res.status(400).json({error:"Invalid result"});
 const enrolled=db.prepare("SELECT 1 FROM enrollments WHERE student_id=? AND course_id=?").get(req.user.id,courseId);
 if(!enrolled)return res.status(403).json({error:"Enroll first"});
 const r=db.prepare("INSERT INTO results(student_id,course_id,score,total) VALUES(?,?,?,?)").run(req.user.id,courseId,score,total);
 res.status(201).json({id:r.lastInsertRowid});
});
router.get("/mine",auth,(req,res)=>{
 const results=db.prepare("SELECT r.id,r.score,r.total,r.created_at,c.title FROM results r JOIN courses c ON c.id=r.course_id WHERE r.student_id=? ORDER BY r.id DESC").all(req.user.id);
 res.json({results});
});
module.exports=router;
