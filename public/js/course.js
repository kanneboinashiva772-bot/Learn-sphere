const api=async(url,opt={})=>{const r=await fetch(url,opt),d=await r.json();if(!r.ok)throw Error(d.error||"Request failed");return d};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
(async()=>{
 const id=new URLSearchParams(location.search).get("id");
 try{
  const me=await api("/api/auth/me"),d=await api("/api/courses/"+id);
  course.innerHTML=`<h1>${esc(d.course.title)}</h1><p>${esc(d.course.description)}</p><p>Instructor: ${esc(d.course.instructor)}</p>`;
  if(me.user.role==="student"){
   course.innerHTML+=`<button id="enroll">Enroll in Course</button>`;
   enroll.onclick=async()=>{try{await api("/api/courses/"+id+"/enroll",{method:"POST"});alert("Enrolled successfully")}catch(e){alert(e.message)}};
   resources.innerHTML="<h2>Resources</h2>"+(d.resources.length?d.resources.map(x=>`<div class='resource'>📘 ${esc(x.title)} — <a class='link' target='_blank' rel='noopener' href='${esc(x.url)}'>Open</a></div>`).join(""):"No resources yet.");
   if(d.quizzes.length)quiz.innerHTML="<h2>Quiz</h2><form id='qform'>"+d.quizzes.map((q,i)=>`<div class='question'><b>${i+1}. ${esc(q.question)}</b><label><input type='radio' name='q${i}' value='A'> A. ${esc(q.option_a)}</label><label><input type='radio' name='q${i}' value='B'> B. ${esc(q.option_b)}</label><label><input type='radio' name='q${i}' value='C'> C. ${esc(q.option_c)}</label><label><input type='radio' name='q${i}' value='D'> D. ${esc(q.option_d)}</label></div>`).join("")+"<button>Submit Quiz</button></form>";
   qform?.addEventListener("submit",async e=>{e.preventDefault();const answers=(await api("/api/quizzes/"+id+"/answers")).answers;let score=0;answers.forEach((x,i)=>{if(document.querySelector(`input[name=q${i}]:checked`)?.value===x.answer)score++});await api("/api/results",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({courseId:Number(id),score,total:answers.length})});quiz.innerHTML=`<h2>Result</h2><div class='score'>${score}/${answers.length}</div><p class='success'>Saved to server database.</p>`});
  }else{
   manage.classList.remove("hidden");
   resources.innerHTML="<h2>Resources</h2>"+(d.resources.length?d.resources.map(x=>`<div class='resource'>📘 ${esc(x.title)} — ${esc(x.url)}</div>`).join(""):"No resources yet.");
   quiz.innerHTML="<h2>Questions</h2>"+(d.quizzes.length?d.quizzes.map(q=>`<div class='question'><b>${esc(q.question)}</b></div>`).join(""):"No questions yet.");
   resourceForm.onsubmit=async e=>{e.preventDefault();try{await api("/api/courses/"+id+"/resources",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:rtitle.value,url:rurl.value})});manageMsg.textContent="Resource added";setTimeout(()=>location.reload(),400)}catch(x){manageMsg.textContent=x.message}};
   quizForm.onsubmit=async e=>{e.preventDefault();try{await api("/api/quizzes/"+id,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:question.value,a:a.value,b:b.value,c:c.value,d:d.value,answer:answer.value})});manageMsg.textContent="Question added";setTimeout(()=>location.reload(),400)}catch(x){manageMsg.textContent=x.message}};
  }
 }catch(e){document.body.innerHTML="<main><p class='error'>"+esc(e.message)+"</p></main>"}
})();