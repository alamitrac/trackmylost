import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
//  TRADUCTIONS
// ─────────────────────────────────────────────
const translations = {
  fr: {
    dir: "ltr",
    nav: ["Accueil", "Signalement", "Objets Trouvés", "Rechercher"],
    account: "Mon compte",
    stat1: "Signale-\nments", stat2: "Résolus", stat3: "Jours\nactif",
    edit: "Modifier le profil", logout: "Se déconnecter", admin: "Admin Panel",
    sectionInfo: "Informations personnelles",
    prenom: "PRÉNOM", nom: "NOM DE FAMILLE", dob: "DATE DE NAISSANCE",
    genre: "GENRE", email: "ADRESSE E-MAIL OU NUMÉRO DE TÉL.",
    pwd: "NOUVEAU MOT DE PASSE", pwdPh: "Nouveau mot de passe",
    save: "Enregistrer", cancelEdit: "Annuler",
    sectionSig: "Mes signalements", actif: "Actif", resolu: "Résolu",
    profileSaved: "Profil enregistré avec succès !",
    logoutConfirm: "Vous avez été déconnecté.",
    backToProfile: "← Retour au profil",
    sigs: [
      { titre: "Sac à dos noir perdu",       lieu: "Casablanca", date: "28 Fév 2026", st: "actif"  },
      { titre: "Clés de voiture retrouvées", lieu: "Rabat",      date: "14 Fév 2026", st: "resolu" },
      { titre: "Téléphone Samsung Galaxy",   lieu: "Agadir",     date: "05 Jan 2026", st: "resolu" },
      { titre: "Portefeuille brun perdu",    lieu: "Marrakech",  date: "19 Mar 2026", st: "actif"  },
    ],
    langs: ["Français", "العربية", "English"],
  },
  ar: {
    dir: "rtl",
    nav: ["الرئيسية", "إبلاغ", "الأشياء المفقودة", "بحث"],
    account: "حسابي",
    stat1: "البلاغات", stat2: "محلول", stat3: "أيام\nنشط",
    edit: "تعديل الملف الشخصي", logout: "تسجيل الخروج", admin: "لوحة الإدارة",
    sectionInfo: "المعلومات الشخصية",
    prenom: "الاسم الأول", nom: "اسم العائلة", dob: "تاريخ الميلاد",
    genre: "الجنس", email: "البريد الإلكتروني أو رقم الهاتف",
    pwd: "كلمة مرور جديدة", pwdPh: "كلمة مرور جديدة",
    save: "حفظ", cancelEdit: "إلغاء",
    sectionSig: "بلاغاتي", actif: "نشط", resolu: "محلول",
    profileSaved: "تم حفظ الملف الشخصي بنجاح!",
    logoutConfirm: "تم تسجيل خروجك.",
    backToProfile: "رجوع →",
    sigs: [
      { titre: "حقيبة سوداء مفقودة",          lieu: "الدار البيضاء", date: "28 فبراير 2026", st: "actif"  },
      { titre: "مفاتيح سيارة تم العثور عليها", lieu: "الرباط",       date: "14 فبراير 2026", st: "resolu" },
      { titre: "هاتف سامسونج غالاكسي",         lieu: "أكادير",       date: "05 يناير 2026",  st: "resolu" },
      { titre: "محفظة بنية مفقودة",            lieu: "مراكش",        date: "19 مارس 2026",   st: "actif"  },
    ],
    langs: ["Français", "العربية", "English"],
  },
  en: {
    dir: "ltr",
    nav: ["Home", "Report", "Found Items", "Search"],
    account: "My Account",
    stat1: "Reports", stat2: "Resolved", stat3: "Active\nDays",
    edit: "Edit Profile", logout: "Sign Out", admin: "Admin Panel",
    sectionInfo: "Personal Information",
    prenom: "FIRST NAME", nom: "LAST NAME", dob: "DATE OF BIRTH",
    genre: "GENDER", email: "EMAIL ADDRESS OR PHONE NUMBER",
    pwd: "NEW PASSWORD", pwdPh: "New password",
    save: "Save", cancelEdit: "Cancel",
    sectionSig: "My Reports", actif: "Active", resolu: "Resolved",
    profileSaved: "Profile saved successfully!",
    logoutConfirm: "You have been signed out.",
    backToProfile: "← Back",
    sigs: [
      { titre: "Lost black backpack",  lieu: "Casablanca", date: "Feb 28, 2026", st: "actif"  },
      { titre: "Car keys found",       lieu: "Rabat",      date: "Feb 14, 2026", st: "resolu" },
      { titre: "Samsung Galaxy phone", lieu: "Agadir",     date: "Jan 05, 2026", st: "resolu" },
      { titre: "Lost brown wallet",    lieu: "Marrakech",  date: "Mar 19, 2026", st: "actif"  },
    ],
    langs: ["Français", "العربية", "English"],
  },
};

const LANG_KEYS = ["fr", "ar", "en"];

// ─────────────────────────────────────────────
//  ICÔNES
// ─────────────────────────────────────────────
const SearchIcon = ({ size = 28, color = "white" }) => (
  <e cx="11" cy="11" r="3" stroke={color} strokeWidth="1.5" />

);
const UserIcon = ({ size = 30, color = "#94a3b8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill={color} />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={color} />
  </svg>
);
const PinIcon = () => (
  <svg width="10" height="13" viewBox="0 0 12 16" fill="none">
    <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z" fill="#e8821a" />
    <circle cx="6" cy="5" r="2" fill="white" />
  </svg>
);

// ─────────────────────────────────────────────
//  HELPERS CHAMPS
// ─────────────────────────────────────────────
const FieldLabel = ({ text, isRtl }) => (
  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: ".5px",
    textTransform: "uppercase", marginBottom: 4, display: "block",
    textAlign: isRtl ? "right" : "left" }}>{text}</span>
);
const FieldView = ({ label, value, isRtl }) => (
  <div>
    <FieldLabel text={label} isRtl={isRtl} />
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 7, padding: "8px 10px",
      fontSize: 13, color: "#1e293b", background: "#f8fafc", minHeight: 36,
      textAlign: isRtl ? "right" : "left" }}>{value || "—"}</div>
  </div>
);
const FieldEdit = ({ label, isRtl, ...p }) => (
  <div>
    <FieldLabel text={label} isRtl={isRtl} />
    <input {...p} style={{ border: "1.5px solid #e8821a", borderRadius: 7, padding: "8px 10px",
      fontSize: 13, color: "#1e293b", background: "white", outline: "none", width: "100%",
      direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left",
      boxSizing: "border-box" }} />
  </div>
);

// ─────────────────────────────────────────────
//  PAGE DÉCONNEXION
// ─────────────────────────────────────────────
function LogoutPage({ t, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "white", borderRadius: 16, padding: "3rem 2.5rem",
        maxWidth: 400, width: "90%", textAlign: "center",
        boxShadow: "0 4px 24px #0001", border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>👋</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2e4a", marginBottom: 10 }}>
          {t.logoutConfirm}
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 28 }}>TrackMyLost</div>
        <button onClick={onBack} style={{ background: "#e8821a", color: "white", border: "none",
          borderRadius: 8, padding: "10px 24px", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
          {t.backToProfile}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
export default function Moncompte() {
  const navigate = useNavigate();

  const [lang, setLang]             = useState("fr");
  const [showLogout, setShowLogout] = useState(false);
  const [isEditing, setIsEditing]   = useState(false);
  const [saved, setSaved]           = useState(false);

  const [profile, setProfile] = useState({
    prenom: "Yassine", nom: "Sardi",
    dob: "20/07/2004", genre: "Homme",
    email: "Sardiy89@gmail.com", pwd: "",
  });
  const [form, setForm] = useState({ ...profile });

  const t     = translations[lang];
  const isRtl = t.dir === "rtl";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave   = () => { setProfile({ ...form }); setIsEditing(false); setSaved(true); };
  const handleCancel = () => { setForm({ ...profile }); setIsEditing(false); };
  const handleEdit   = () => { setForm({ ...profile }); setIsEditing(true); setSaved(false); };

  if (showLogout) return <LogoutPage t={t} onBack={() => setShowLogout(false)} />;

  const card = { background: "white", borderRadius: 12, border: "0.5px solid #e2e8f0",
    padding: "1.25rem", boxShadow: "0 1px 6px #0000000a" };
  const sectionTitle = { fontSize: 14, fontWeight: 600, color: "#1e293b",
    marginBottom: ".9rem", textAlign: isRtl ? "right" : "left" };

  const navBtn = (active) => ({
    color: active ? "#ffffff" : "#cbd5e1",
    fontSize: 13, fontWeight: active ? 700 : 500,
    background: active ? "rgba(255,255,255,.2)" : "transparent",
    border: "none", padding: "6px 14px", borderRadius: 6,
    cursor: "pointer", fontFamily: "inherit",
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ══════════════════════════════════════
           NAVBAR avec useNavigate
           → routes exactes de App.js
      ══════════════════════════════════════ */}
      <nav style={{ background: "#1a2e4a", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 1.5rem", height: 52, direction: t.dir }}>

        {/* Logo → /home */}
        <button onClick={() => navigate("/home")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
          <SearchIcon size={28} color="white" />
        </button>

        {/* LIENS NAV */}
        <div style={{ display: "flex", gap: 4, flexDirection: isRtl ? "row-reverse" : "row" }}>

          {/* Accueil → /home */}
          <button
            onClick={() => navigate("/home")}
            style={navBtn(false)}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.15)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#cbd5e1"; }}
          >
            {t.nav[0]}
          </button>

          {/* Signalement → /signalement */}
          <button
            onClick={() => navigate("/signalement")}
            style={navBtn(false)}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.15)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#cbd5e1"; }}
          >
            {t.nav[1]}
          </button>

          {/* Objets Trouvés → /home (pas de route dédiée dans App.js) */}
          <button
            onClick={() => navigate("/home")}
            style={navBtn(false)}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.15)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#cbd5e1"; }}
          >
            {t.nav[2]}
          </button>

          {/* Rechercher → /home */}
          <button
            onClick={() => navigate("/home")}
            style={navBtn(false)}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.15)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#cbd5e1"; }}
          >
            {t.nav[3]}
          </button>
        </div>

        {/* Mon compte → /moncompte (page actuelle) */}
        <button onClick={() => navigate("/moncompte")}
          style={{ display: "flex", alignItems: "center", gap: 8, color: "white",
            fontSize: 12, background: "rgba(255,255,255,.15)", border: "none",
            borderRadius: 20, padding: "4px 12px 4px 4px", cursor: "pointer", fontFamily: "inherit" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e8821a",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserIcon size={15} color="white" />
          </div>
          <span style={{ fontWeight: 600 }}>{t.account}</span>
        </button>
      </nav>

      {/* ══════════════════════════════════════
           CORPS — MON COMPTE
      ══════════════════════════════════════ */}
      <div style={{ background: "#f0f2f5", padding: "1.5rem",
        minHeight: "calc(100vh - 52px)", direction: t.dir }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr",
          gap: "1.2rem", maxWidth: 820, margin: "0 auto" }}>

          {/* SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ ...card, textAlign: "center" }}>

              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e2e8f0",
                margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center",
                border: "2.5px solid #e8821a", position: "relative" }}>
                <UserIcon size={30} color="#94a3b8" />
                <div style={{ position: "absolute", bottom: 1, right: 1, width: 14, height: 14,
                  background: "#22c55e", borderRadius: "50%", border: "2px solid white" }} />
              </div>

              <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                {profile.prenom} {profile.nom}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{profile.email}</div>

              <div style={{ display: "flex", justifyContent: "center", gap: "1.2rem",
                padding: ".7rem 0", margin: ".8rem 0",
                borderTop: ".5px solid #f1f5f9", borderBottom: ".5px solid #f1f5f9" }}>
                {[{ num: 4, lbl: t.stat1 }, { num: 2, lbl: t.stat2 }, { num: 12, lbl: t.stat3 }].map(({ num, lbl }) => (
                  <div key={lbl}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", textAlign: "center" }}>{num}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "center",
                      lineHeight: 1.3, whiteSpace: "pre-line" }}>{lbl}</div>
                  </div>
                ))}
              </div>

              {!isEditing ? (
                <button onClick={handleEdit} style={{ background: "#1a2e4a", color: "white",
                  border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12,
                  width: "100%", cursor: "pointer", fontWeight: 500, marginBottom: 7 }}>
                  ✏️ {t.edit}
                </button>
              ) : (
                <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
                  <button onClick={handleSave} style={{ background: "#22c55e", color: "white",
                    border: "none", borderRadius: 8, padding: "7px 10px",
                    fontSize: 12, flex: 1, cursor: "pointer" }}>✅ {t.save}</button>
                  <button onClick={handleCancel} style={{ background: "white", color: "#94a3b8",
                    border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 10px",
                    fontSize: 12, flex: 1, cursor: "pointer" }}>{t.cancelEdit}</button>
                </div>
              )}

              {/* Déconnecter → revient à /login */}
              <button onClick={() => { setShowLogout(true); setTimeout(() => navigate("/login"), 2000); }}
                style={{ background: "white", color: "#e8821a", border: "1.5px solid #e8821a",
                  borderRadius: 8, padding: "6px 14px", fontSize: 12,
                  width: "100%", cursor: "pointer", fontWeight: 500 }}>
                🚪 {t.logout}
              </button>

              {/* Admin → /admin */}
              <div onClick={() => navigate("/admin")}
                style={{ fontSize: 11, color: "#94a3b8", marginTop: 8,
                  cursor: "pointer", textDecoration: "underline" }}>{t.admin}</div>
            </div>

            <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              
              
            </div>
          </div>

          {/* CONTENU */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {saved && !isEditing && (
              <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 10,
                padding: "10px 16px", display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, color: "#166534", fontWeight: 500 }}>
                ✅ {t.profileSaved}
              </div>
            )}

            {/* LECTURE */}
            {!isEditing && (
              <div style={card}>
                <div style={sectionTitle}>{t.sectionInfo}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <FieldView label={t.prenom} value={profile.prenom} isRtl={isRtl} />
                  <FieldView label={t.nom}    value={profile.nom}    isRtl={isRtl} />
                  <FieldView label={t.dob}    value={profile.dob}    isRtl={isRtl} />
                  <FieldView label={t.genre}  value={profile.genre}  isRtl={isRtl} />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <FieldView label={t.email} value={profile.email} isRtl={isRtl} />
                  </div>
                </div>
                <div style={{ marginTop: 12, textAlign: isRtl ? "left" : "right" }}>
                  <button onClick={handleEdit} style={{ background: "#1a2e4a", color: "white",
                    border: "none", borderRadius: 8, padding: "8px 20px",
                    fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                    ✏️ {t.edit}
                  </button>
                </div>
              </div>
            )}

            {/* ÉDITION */}
            {isEditing && (
              <div style={{ ...card, border: "1.5px solid #e8821a" }}>
                <div style={sectionTitle}>{t.sectionInfo}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <FieldEdit label={t.prenom} isRtl={isRtl} name="prenom" value={form.prenom} onChange={handleChange} />
                  <FieldEdit label={t.nom}    isRtl={isRtl} name="nom"    value={form.nom}    onChange={handleChange} />
                  <FieldEdit label={t.dob}    isRtl={isRtl} name="dob"    value={form.dob}    onChange={handleChange} />
                  <FieldEdit label={t.genre}  isRtl={isRtl} name="genre"  value={form.genre}  onChange={handleChange} />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <FieldEdit label={t.email} isRtl={isRtl} name="email" value={form.email} onChange={handleChange} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <FieldEdit label={t.pwd} isRtl={isRtl} type="password" name="pwd"
                      placeholder={t.pwdPh} value={form.pwd} onChange={handleChange} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: "1rem",
                  justifyContent: isRtl ? "flex-start" : "flex-end" }}>
                  <button onClick={handleCancel} style={{ background: "white", color: "#94a3b8",
                    border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 18px",
                    fontSize: 12, cursor: "pointer" }}>{t.cancelEdit}</button>
                  <button onClick={handleSave} style={{ background: "#e8821a", color: "white",
                    border: "none", borderRadius: 8, padding: "8px 20px",
                    fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                    ✅ {t.save}
                  </button>
                </div>
              </div>
            )}

            {/* Signalements */}
            <div style={card}>
              <div style={sectionTitle}>{t.sectionSig}</div>
              {t.sigs.map((sig, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0",
                  borderBottom: i < t.sigs.length - 1 ? ".5px solid #f1f5f9" : "none",
                  flexDirection: isRtl ? "row-reverse" : "row" }}>
                  <div style={{ width: 20, height: 20, background: "#fef3e2", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <PinIcon />
                  </div>
                  <div style={{ flex: 1, textAlign: isRtl ? "right" : "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#1e293b" }}>{sig.titre}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>{sig.lieu} · {sig.date}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20,
                    fontWeight: 500, whiteSpace: "nowrap",
                    background: sig.st === "actif" ? "#fef3e2" : "#e8f5e9",
                    color:      sig.st === "actif" ? "#c46a0a" : "#2e7d32" }}>
                    {sig.st === "actif" ? t.actif : t.resolu}
                  </span>
                </div>
              ))}
            </div>

            {/* Langue */}
            <div style={{ display: "flex", justifyContent: "center", gap: "1.2rem" }}>
              {LANG_KEYS.map((k, i) => (
                <span key={k} onClick={() => setLang(k)} style={{ fontSize: 11, cursor: "pointer",
                  color: lang === k ? "#1a2e4a" : "#94a3b8", fontWeight: lang === k ? 700 : 400,
                  padding: "4px 10px", borderRadius: 20,
                  background: lang === k ? "#e2e8f0" : "transparent" }}>
                  {translations.fr.langs[i]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
