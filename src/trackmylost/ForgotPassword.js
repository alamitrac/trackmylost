import { useState } from "react";
import { useNavigate } from "react-router-dom";


function ForgotPassword() {
  const navigate = useNavigate();
  const [lang, setLang]             = useState("fr");
  const [step, setStep]             = useState(1);
  const [email, setEmail]           = useState("");
  const [code, setCode]             = useState(["", "", "", ""]);
  const [newPwd, setNewPwd]         = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [msg, setMsg]               = useState("");

  const text = {
    fr: {
      title1: "Mot de passe oublié ?",
      sub1:   "Entrez votre e-mail pour recevoir un code.",
      ph1:    "Adresse e-mail ou numéro",
      btn1:   "Envoyer le code",
      title2: "Code de vérification",
      sub2:   "Code envoyé à",
      btn2:   "Vérifier",
      resend: "Renvoyer le code",
      title3: "Nouveau mot de passe",
      ph3a:   "Nouveau mot de passe",
      ph3b:   "Confirmer le mot de passe",
      btn3:   "Réinitialiser",
      title4: "Mot de passe réinitialisé !",
      sub4:   "Votre mot de passe a été mis à jour.",
      btn4:   "Se connecter",
      back:   "← Retour à la connexion",
    },
    ar: {
      title1: "نسيت كلمة المرور؟",
      sub1:   "أدخل بريدك لاستلام رمز.",
      ph1:    "البريد الإلكتروني أو الهاتف",
      btn1:   "إرسال الرمز",
      title2: "رمز التحقق",
      sub2:   "تم إرسال الرمز إلى",
      btn2:   "تحقق",
      resend: "إعادة إرسال",
      title3: "كلمة مرور جديدة",
      ph3a:   "كلمة المرور الجديدة",
      ph3b:   "تأكيد كلمة المرور",
      btn3:   "إعادة التعيين",
      title4: "تمت إعادة التعيين!",
      sub4:   "تم تحديث كلمة مرورك.",
      btn4:   "تسجيل الدخول",
      back:   "العودة إلى تسجيل الدخول →",
    },
    en: {
      title1: "Forgot Password?",
      sub1:   "Enter your email to receive a code.",
      ph1:    "Email or phone number",
      btn1:   "Send Code",
      title2: "Verification Code",
      sub2:   "Code sent to",
      btn2:   "Verify",
      resend: "Resend Code",
      title3: "New Password",
      ph3a:   "New password",
      ph3b:   "Confirm password",
      btn3:   "Reset Password",
      title4: "Password Reset!",
      sub4:   "Your password has been updated.",
      btn4:   "Sign In",
      back:   "← Back to Login",
    },
  };

  const t = text[lang];

  /* ── handlers ── */
  const handleStep1 = () => {
    if (!email.trim()) { setMsg("Veuillez remplir ce champ."); return; }
    setMsg(""); setStep(2);
  };

  const handleCode = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code]; next[i] = val; setCode(next);
    if (val && i < 3) document.getElementById(`c${i + 1}`)?.focus();
  };

  const handleStep2 = () => {
    if (code.some(c => !c)) { setMsg("Entrez le code complet."); return; }
    setMsg(""); setStep(3);
  };

  const handleStep3 = () => {
    if (newPwd.length < 8)   { setMsg("Minimum 8 caractères."); return; }
    if (newPwd !== confirmPwd){ setMsg("Mots de passe différents."); return; }
    setMsg(""); setStep(4);
  };

  return (
    <div className="container">

      {/* ── GAUCHE — identique à Login ── */}
      <div className="left">
        <img src="/11.jpeg" alt="logo" className="logo-img" />
        <p>
          TrackMyLost est une plateforme permettant de signaler
          les disparitions et objets perdus afin d'aider les
          citoyens à les retrouver.
        </p>
        <br />
        <button className="plus"><b>PLUS</b></button>
        <br />
        <div className="la">
          <span onClick={() => setLang("fr")}>Français</span>
          <span onClick={() => setLang("ar")}>العربية</span>
          <span onClick={() => setLang("en")}>English</span>
        </div>
      </div>

      {/* ── DROITE — formulaire ── */}
      <div className="login-box">

        {/* ═══ ÉTAPE 1 : EMAIL ═══ */}
        {step === 1 && (
          <>
            <h2>{t.title1}</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: -6, marginBottom: 16 }}>
              {t.sub1}
            </p>

            <input
              type="text"
              placeholder={t.ph1}
              value={email}
              onChange={e => { setEmail(e.target.value); setMsg(""); }}
              onKeyDown={e => e.key === "Enter" && handleStep1()}
            />

            <button className="login-btn" onClick={handleStep1}>
              {t.btn1}
            </button>
            <br /><br />
            <p style={{ color: "#ef4444", fontSize: 12 }}>{msg}</p>
            <button className="create-btn" onClick={() => navigate("/login")}>
              {t.back}
            </button>
          </>
        )}

        {/* ═══ ÉTAPE 2 : CODE 4 CHIFFRES ═══ */}
        {step === 2 && (
          <>
            <h2>{t.title2}</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: -6, marginBottom: 20 }}>
              {t.sub2} <strong style={{ color: "#1a2e4a" }}>{email}</strong>
            </p>

            {/* Cases code */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
              {code.map((c, i) => (
                <input
                  key={i}
                  id={`c${i}`}
                  type="text"
                  maxLength={1}
                  value={c}
                  onChange={e => handleCode(e.target.value, i)}
                  onKeyDown={e => {
                    if (e.key === "Backspace" && !code[i] && i > 0)
                      document.getElementById(`c${i - 1}`)?.focus();
                  }}
                  style={{
                    width: 54, height: 54, borderRadius: 10,
                    border: `2px solid ${c ? "#1a2e4a" : "#e2e8f0"}`,
                    background: c ? "#eef2ff" : "#f8fafc",
                    textAlign: "center", fontSize: 22, fontWeight: 700,
                    color: "#1a2e4a", outline: "none",
                    transition: "border .2s, background .2s",
                  }}
                />
              ))}
            </div>

            <button className="login-btn" onClick={handleStep2}>{t.btn2}</button>
            <br /><br />
            <p style={{ color: "#ef4444", fontSize: 12 }}>{msg}</p>
            <button className="create-btn"
              onClick={() => { setCode(["","","",""]); setMsg(""); }}>
              🔄 {t.resend}
            </button>
            <br /><br />
            <button className="create-btn" onClick={() => { setStep(1); setMsg(""); }}>
              {t.back}
            </button>
          </>
        )}

        {/* ═══ ÉTAPE 3 : NOUVEAU MOT DE PASSE ═══ */}
        {step === 3 && (
          <>
            <h2>{t.title3}</h2>

            <input
              type="password"
              placeholder={t.ph3a}
              value={newPwd}
              onChange={e => { setNewPwd(e.target.value); setMsg(""); }}
            />

            {/* Barre de force */}
            {newPwd.length > 0 && (
              <div style={{ display: "flex", gap: 4, margin: "6px 0 10px" }}>
                {[1,2,3,4].map(n => {
                  const s = newPwd.length < 4 ? 1
                    : newPwd.length < 8 ? 2
                    : /[A-Z]/.test(newPwd) && /\d/.test(newPwd) ? 4 : 3;
                  const colors = ["","#ef4444","#f97316","#f59e0b","#22c55e"];
                  return <div key={n} style={{ flex:1, height:4, borderRadius:4,
                    background: s >= n ? colors[s] : "#f1f5f9", transition:"background .3s" }} />;
                })}
              </div>
            )}

            <input
              type="password"
              placeholder={t.ph3b}
              value={confirmPwd}
              onChange={e => { setConfirmPwd(e.target.value); setMsg(""); }}
              style={{
                borderColor: confirmPwd
                  ? confirmPwd === newPwd ? "#22c55e" : "#ef4444"
                  : undefined,
              }}
            />

            <button className="login-btn" onClick={handleStep3}>{t.btn3}</button>
            <br /><br />
            <p style={{ color: "#ef4444", fontSize: 12 }}>{msg}</p>
            <button className="create-btn" onClick={() => { setStep(2); setMsg(""); }}>
              {t.back}
            </button>
          </>
        )}

        {/* ═══ ÉTAPE 4 : SUCCÈS ═══ */}
        {step === 4 && (
          <>
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "#e8821a",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", fontSize: 32, color: "white",
                boxShadow: "0 6px 20px rgba(232,130,26,.3)",
              }}>✓</div>
              <h2 style={{ color: "#1a2e4a" }}>{t.title4}</h2>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>{t.sub4}</p>
            </div>
            <button className="login-btn" onClick={() => navigate("/login")}>
              {t.btn4}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;
