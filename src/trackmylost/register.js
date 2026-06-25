





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";


const translations = {
  fr: {
    title: "Créer un compte",
    subtitle: "C'est simple et rapide.",
    firstName: "Prénom",
    lastName: "Nom de famille",
    day: "Jour",
    month: "Mois",
    year: "Année",
    male: "Homme",
    female: "Femme",
    email: "Adresse e-mail ou numéro de tél.",
    password: "Nouveau mot de passe",
    submit: "S'inscrire",
    haveAccount: "Vous avez déjà un compte ? Se connecter"
  },
  en: {
    title: "Create an account",
    subtitle: "It's quick and easy.",
    firstName: "First name",
    lastName: "Last name",
    day: "Day",
    month: "Month",
    year: "Year",
    male: "Male",
    female: "Female",
    email: "Email or phone",
    password: "New password",
    submit: "Sign up",
    haveAccount: "Already have an account? Login"
  },
  ar: {
    title: "إنشاء حساب",
    subtitle: "الأمر سهل وسريع",
    firstName: "الاسم",
    lastName: "النسب",
    day: "اليوم",
    month: "الشهر",
    year: "السنة",
    male: "ذكر",
    female: "أنثى",
    email: "البريد الإلكتروني أو الهاتف",
    password: "كلمة المرور",
    submit: "تسجيل",
    haveAccount: "لديك حساب؟ تسجيل الدخول"
  }
};

function Register() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("fr");
  const t = translations[lang];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="container" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* LEFT SIDE */}
      <div className="left">
        <div className="logo">
          <img src="/11.jpeg" alt="logo" className="logo-img" />
          
    </div>

        <p className="desc">
          Les personnes qui utilisent notre service ont pu importer vos coordonnées sur TrackMyLost.
        </p>

        {/* LANGUAGES UNDER PARAGRAPH */}
        <div className="languages">
          <span onClick={() => setLang("fr")}>Français</span>
          <span onClick={() => setLang("ar")}>Arabic</span>
          <span onClick={() => setLang("en")}>English</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
        <form className="form" onSubmit={handleSubmit}>
          
          <h2>{t.title}</h2>
          <p className="subtitle">{t.subtitle}</p>

          <div className="row">
            <input placeholder={t.firstName} />
            <input placeholder={t.lastName} />
          </div>

          <div className="row">
            <input placeholder={t.day} />
            <input placeholder={t.month} />
            <input placeholder={t.year} />
          </div>

          <div className="row gender">
            <label><input type="radio" /> {t.male}</label>
            <label><input type="radio" /> {t.female}</label>
          </div>

          <input placeholder={t.email} />
          <input type="password" placeholder={t.password} />

          <button type="submit" className="btn">{t.submit}</button>

          {/* TEXT ONLY (NO BUTTON) */}
          <p className="login-text" onClick={() => navigate("/login")}>
            
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;
