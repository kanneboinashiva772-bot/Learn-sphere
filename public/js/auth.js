const form=document.getElementById("form");
form?.addEventListener("submit",async e=>{
 e.preventDefault();
 const register=location.pathname.includes("register");
 const body=register?{name:document.getElementById("name").value,email:email.value,password:password.value,role:role.value}:{email:email.value,password:password.value};
 const r=await fetch(register?"/api/auth/register":"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 const d=await r.json();msg.textContent=d.error||d.message;msg.className=r.ok?"success":"error";
 if(r.ok)setTimeout(()=>location.href=register?"/login.html":"/dashboard.html",600);
});