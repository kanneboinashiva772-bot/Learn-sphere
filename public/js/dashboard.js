const api=async(url,opt={})=>{const r=await fetch(url,opt),d=await r.json();if(!r.ok)throw Error(d.error||"Request failed");return d};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
(async()=>{
 try{
  const me=await api("/api/auth/me");user.textContent=me.user.name+" • "+me.user.role;welcome.textContent="Welcome, "+me.user.name+"!";
  if(me.user.role==="instructor")instructor.classList.remove("hidden");
  const d=await api("/api/courses");
  courses.innerHTML=d.courses.map(c=>`<div><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><p>Instructor: ${esc(c.instructor)}</p><a class="btn" href="/course.html?id=${c.id}">Open Course</a></div>`).join("");
  const rr=await api("/api/results/mine");results.innerHTML=rr.results.length?rr.results.map(x=>`<div class="panel"><b>${esc(x.title)}</b> — ${x.score}/${x.total}</div>`).join(""):"No results yet.";
 }catch(e){location.href="/login.html"}
})();
logout.onclick=async()=>{await fetch("/api/auth/logout",{method:"POST"});location.href="/login.html"};
courseForm?.addEventListener("submit",async e=>{e.preventDefault();try{await api("/api/courses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:ctitle.value,description:cdesc.value})});courseMsg.textContent="Course created";courseMsg.className="success";setTimeout(()=>location.reload(),500)}catch(x){courseMsg.textContent=x.message;courseMsg.className="error"}});