
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Login(){

const navigate = useNavigate()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [remember,setRemember] = useState(false)
const [lang,setLang] = useState("fr")
const [msg,setMsg] = useState("")

const text = {

fr:{
title:"Accéder au compte",
email:"Adresse e-mail ou numéro",
password:"Mot de passe",
remember:"Gardez-moi connecté",
forgot:"Mot de passe oublié ?",
login:"Se connecter",
create:"Créer un nouveau compte"
},

ar:{
title:"الدخول للحساب",
email:"البريد الإلكتروني أو الهاتف",
password:"كلمة المرور",
remember:"تذكرني",
forgot:"نسيت كلمة المرور؟",
login:"تسجيل الدخول",
create:"إنشاء حساب جديد"
},

en:{
title:"Login",
email:"Email or phone",
password:"Password",
remember:"Remember me",
forgot:"Forgot password?",
login:"Sign in",
create:"Create new account"
}

}


const handleLogin = ()=>{

if(email==="" || password===""){
setMsg("Remplir les champs")
return
}

if(remember){
localStorage.setItem("user",email)
}

navigate("/moncompte");

}

const forgotPassword = ()=>{
navigate("/forgot-password");
}

const createAccount = ()=>{
navigate("/register");
}

return(

<div className="container">

<div className="left">


<img src="/11.jpeg" alt="logo" className="logo-img" />

<p>
TrackMyLost est une plateforme permettant
de signaler les disparitions et objets perdus
afin d'aider les citoyens à les retrouver.
</p> <br></br>

<button className="plus"><b>PLUS</b></button>
<br></br>
<div className="la">
<span onClick={() => setLang("fr")}>Français</span>
        <span onClick={() => setLang("ar")}>العربية</span>
        <span onClick={() => setLang("en")}>English</span>
        </div>

</div>

<div className="login-box">

<h2>{text[lang].title}</h2>

<input
type="text"
placeholder={text[lang].email}
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder={text[lang].password}
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<div className="options">

<label>

<input id="mot"
type="checkbox"
checked={remember}
onChange={()=>setRemember(!remember)}
/><br></br>

{text[lang].remember}

</label>

<span onClick={forgotPassword} id="mot">
{text[lang].forgot}
</span> <br></br>

</div>
<button className="login-btn" onClick={handleLogin}>
{text[lang].login}
</button> <br></br>
<br></br>

<button className="create-btn" onClick={createAccount}  >
{text[lang].create}
</button> <br></br>
<br></br>
<p>{msg}</p>

</div>

</div>
);
}
export default Login;