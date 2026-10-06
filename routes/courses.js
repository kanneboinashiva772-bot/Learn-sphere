const router=require("express").Router();
const db=require("../db");
const {auth,role}=require("../middleware/auth");

function validUrl(value){
 try{return ["http:","https:"].includes(new URL(value).protocol)}catch{return false}
}

router.get("/",auth,(req,res)=>{
 const courses=db.prepare(`
 SELECT c.id,c.title,c.description,u.name instructor,
 EXISTS(SELECT 1 FROM enrollments e WHERE e.course_id=c.id AND e.student_id=?) enrolled
 FROM courses c JOIN users u ON u.id=c.instructor_id ORDER BY c.id DESC
 `).all(req.user.id);
 res.json({courses});
});

router.post("/",auth,role("instructor"),(req,res)=>{
 const title=String(req.body.title||"").trim();
 const description=String(req.body.description||"").trim();
 if(!title||title.length>120||!description||description.length>1000) return res.status(400).json({error:"Enter a valid title and description"});
 const r=db.prepare("INSERT INTO courses(title,description,instructor_id) VALUES(?,?,?)").run(title,description,req.user.id);
 res.status(201).json({courseId:r.lastInsertRowid});
});

router.post("/:id/enroll",auth,role("student"),(req,res)=>{
 const course=db.prepare("SELECT id FROM courses WHERE id=?").get(req.params.id);
 if(!course)return res.status(404).json({error:"Course not found"});
 try{db.prepare("INSERT INTO enrollments(student_id,course_id) VALUES(?,?)").run(req.user.id,course.id)}catch{}
 res.json({message:"Enrolled successfully"});
});

router.get("/:id",auth,(req,res)=>{
 const course=db.prepare("SELECT c.id,c.title,c.description,u.name instructor FROM courses c JOIN users u ON u.id=c.instructor_id WHERE c.id=?").get(req.params.id);
 if(!course)return res.status(404).json({error:"Course not found"});
 const resources=db.prepare("SELECT id,title,url FROM resources WHERE course_id=?").all(req.params.id);
 const quizzes=db.prepare("SELECT id,question,option_a,option_b,option_c,option_d FROM quizzes WHERE course_id=?").all(req.params.id);
 res.json({course,resources,quizzes});
});

router.post("/:id/resources",auth,role("instructor"),(req,res)=>{
 const course=db.prepare("SELECT id FROM courses WHERE id=? AND instructor_id=?").get(req.params.id,req.user.id);
 if(!course)return res.status(403).json({error:"You do not own this course"});
 const title=String(req.body.title||"").trim(),url=String(req.body.url||"").trim();
 if(!title||title.length>120||!validUrl(url))return res.status(400).json({error:"Use a valid http/https resource URL"});
 db.prepare("INSERT INTO resources(course_id,title,url) VALUES(?,?,?)").run(course.id,title,url);
 res.status(201).json({message:"Resource added"});
});

module.exports=router;
