const router=require("express").Router();
const db=require("../db");
const {auth,role}=require("../middleware/auth");

router.post("/:courseId",auth,role("instructor"),(req,res)=>{
 const course=db.prepare("SELECT id FROM courses WHERE id=? AND instructor_id=?").get(req.params.courseId,req.user.id);
 if(!course)return res.status(403).json({error:"You do not own this course"});
 const {question,a,b,c,d,answer}=req.body;
 if(!question||!a||!b||!c||!d||!["A","B","C","D"].includes(answer))return res.status(400).json({error:"Complete every quiz field"});
 db.prepare("INSERT INTO quizzes(course_id,question,option_a,option_b,option_c,option_d,answer) VALUES(?,?,?,?,?,?,?)").run(course.id,question,a,b,c,d,answer);
 res.status(201).json({message:"Question added"});
});

router.get("/:courseId/answers",auth,role("student"),(req,res)=>{
 const enrolled=db.prepare("SELECT 1 FROM enrollments WHERE student_id=? AND course_id=?").get(req.user.id,req.params.courseId);
 if(!enrolled)return res.status(403).json({error:"Enroll in the course first"});
 const answers=db.prepare("SELECT id,answer FROM quizzes WHERE course_id=?").all(req.params.courseId);
 res.json({answers});
});
module.exports=router;
