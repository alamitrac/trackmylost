import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const translations = {
  fr: {
    brandSub: 'Plateforme citoyenne · Maroc',
    badge: 'ESPACE ADMINISTRATEUR',
    titre1: 'Gérez la',
    titre2: 'plateforme en',
    titreAccent: 'toute sécurité.',
    description: 'Accédez au tableau de bord administrateur pour valider les signalements, gérer les utilisateurs et superviser l\'activité de la plateforme.',
    feature1: 'Validation des signalements en attente',
    feature2: 'Gestion des comptes utilisateurs',
    feature3: 'Statistiques et rapports d\'activité',
    formTitre: 'Connexion Admin',
    formSous: 'Accès réservé aux administrateurs autorisés',
    divider: 'IDENTIFIANTS SÉCURISÉS',
    labelEmail: 'Identifiant Administrateur',
    labelPassword: 'Mot de Passe',
    placeholderEmail: 'admin@trackmylost.ma',
    placeholderPassword: '••••••••',
    remember: 'Rester connecté',
    forgot: 'Mot de passe oublié ?',
    btnSubmit: 'Accéder au panneau',
    ssl: 'Connexion sécurisée SSL · Accès journalisé',
    langFr: 'Français (France)',
    langAr: 'Arabic (Maroc)',
    langEn: 'English (UK)',
  },
  ar: {
    brandSub: 'منصة مواطنة · المغرب',
    badge: 'فضاء المدير',
    titre1: 'أدر',
    titre2: 'المنصة',
    titreAccent: 'بكل أمان.',
    description: 'ادخل إلى لوحة تحكم المدير للتحقق من البلاغات وإدارة المستخدمين ومتابعة نشاط المنصة.',
    feature1: 'التحقق من البلاغات المعلقة',
    feature2: 'إدارة حسابات المستخدمين',
    feature3: 'الإحصائيات وتقارير النشاط',
    formTitre: 'تسجيل دخول المدير',
    formSous: 'الوصول مخصص للمديرين المعتمدين فقط',
    divider: 'بيانات الدخول الآمنة',
    labelEmail: 'معرف المدير',
    labelPassword: 'كلمة المرور',
    placeholderEmail: 'admin@trackmylost.ma',
    placeholderPassword: '••••••••',
    remember: 'البقاء متصلاً',
    forgot: 'نسيت كلمة المرور؟',
    btnSubmit: 'الدخول إلى اللوحة',
    ssl: 'اتصال آمن SSL · الوصول مسجل',
    langFr: 'Français (France)',
    langAr: 'Arabic (Maroc)',
    langEn: 'English (UK)',
  },
  en: {
    brandSub: 'Citizen Platform · Morocco',
    badge: 'ADMINISTRATOR SPACE',
    titre1: 'Manage the',
    titre2: 'platform with',
    titreAccent: 'full security.',
    description: 'Access the admin dashboard to validate reports, manage users and monitor platform activity.',
    feature1: 'Validation of pending reports',
    feature2: 'User account management',
    feature3: 'Statistics and activity reports',
    formTitre: 'Admin Login',
    formSous: 'Access reserved for authorized administrators',
    divider: 'SECURE CREDENTIALS',
    labelEmail: 'Administrator ID',
    labelPassword: 'Password',
    placeholderEmail: 'admin@trackmylost.ma',
    placeholderPassword: '••••••••',
    remember: 'Stay connected',
    forgot: 'Forgot password?',
    btnSubmit: 'Access the panel',
    ssl: 'SSL secure connection · Access logged',
    langFr: 'Français (France)',
    langAr: 'Arabic (Maroc)',
    langEn: 'English (UK)',
  },
};

const AdminLogin = () => {
  const navigate = useNavigate(); // ← AJOUT

  const [langue, setLangue] = useState('fr');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const t = translations[langue];
  const isRTL = langue === 'ar';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ← CORRIGÉ : navigate vers /admin
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <div className="admin-login-page" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── PANNEAU GAUCHE ── */}
      <div className="admin-login-left">
        <div className="admin-login-brand">
          <span className="admin-login-brand-dot" />
          <div className="admin-login-brand-info">
            <span className="admin-login-brand-name">TrackMyLost</span>
            <span className="admin-login-brand-sub">{t.brandSub}</span>
          </div>
        </div>

        <div className="admin-login-badge">
          <span className="admin-login-badge-dot" />
          {t.badge}
        </div>

        <h1 className="admin-login-title">
          {t.titre1}<br />
          {t.titre2}<br />
          <span className="admin-login-title-accent">{t.titreAccent}</span>
        </h1>

        <p className="admin-login-description">{t.description}</p>

        <ul className="admin-login-features">
          <li className="admin-login-feature-item admin-login-feature-active">
            <span className="admin-login-feature-icon">✓</span>
            {t.feature1}
          </li>
          <li className="admin-login-feature-item">
            <span className="admin-login-feature-icon">👥</span>
            {t.feature2}
          </li>
          <li className="admin-login-feature-item">
            <span className="admin-login-feature-icon">📊</span>
            {t.feature3}
          </li>
        </ul>
      </div>

      {/* ── PANNEAU DROIT ── */}
      <div className="admin-login-right">

        <div className="admin-login-shield-wrapper">
          <div className="admin-login-shield-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="#f97316" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" stroke="#f97316" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        <h2 className="admin-login-form-title">{t.formTitre}</h2>
        <p className="admin-login-form-subtitle">{t.formSous}</p>

        <div className="admin-login-divider">
          <span className="admin-login-divider-line" />
          <span className="admin-login-divider-text">{t.divider}</span>
          <span className="admin-login-divider-line" />
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>

          <div className="admin-login-field">
            <label className="admin-login-label">{t.labelEmail}</label>
            <div className="admin-login-input-wrapper">
              <svg className="admin-login-input-icon" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                className="admin-login-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.placeholderEmail}
                required
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label className="admin-login-label">{t.labelPassword}</label>
            <div className="admin-login-input-wrapper">
              <svg className="admin-login-input-icon" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                className="admin-login-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t.placeholderPassword}
                required
              />
              <button
                type="button"
                className="admin-login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="admin-login-options">
            <label className="admin-login-remember">
              <input
                type="checkbox"
                className="admin-login-checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              {t.remember}
            </label>
            <button type="button" className="admin-login-forgot">
              {t.forgot}
            </button>
          </div>

          {/* ← BOUTON → navigate('/admin') */}
          <button type="submit" className="admin-login-submit-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            {t.btnSubmit}
          </button>

        </form>

        <div className="admin-login-ssl-note">
          <span className="admin-login-ssl-dot" />
          {t.ssl}
        </div>

        {/* ── SÉLECTEUR DE LANGUE ── */}
        <div className="admin-login-lang-bar">
          <button
            className={`admin-login-lang-btn ${langue === 'fr' ? 'admin-login-lang-active' : ''}`}
            onClick={() => setLangue('fr')}
          >{t.langFr}</button>
          <span className="admin-login-lang-sep">·</span>
          <button
            className={`admin-login-lang-btn ${langue === 'ar' ? 'admin-login-lang-active' : ''}`}
            onClick={() => setLangue('ar')}
          >{t.langAr}</button>
          <span className="admin-login-lang-sep">·</span>
          <button
            className={`admin-login-lang-btn ${langue === 'en' ? 'admin-login-lang-active' : ''}`}
            onClick={() => setLangue('en')}
          >{t.langEn}</button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
