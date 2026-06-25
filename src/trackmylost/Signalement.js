import React, { useState, useRef } from 'react';
import './style.css';

const translations = {
  fr: {
    navAccueil: 'Accueil',
    navAlertes: 'Alertes',
    navObjets: 'Objets Trouvés',
    navRechercher: 'Rechercher',
    monCompte: 'Mon compte',
    titre: 'Créer un signalement',
    categorie: 'Catégorie',
    localisation: 'Localisation',
    date: 'Date',
    description: 'Description',
    ajouterPhoto: 'Ajouter une image',
    indiquezLieu: 'Indiquez le lieu',
    publier: 'Publier',
    photoLabel: 'Cliquez ou glissez une image ici',
    photoFormat: 'PNG, JPG, JPEG — max 5MB',
    langFr: 'Français (France)',
    langAr: 'Arabic (Maroc)',
    langEn: 'English (UK)',
  },
  ar: {
    navAccueil: 'الرئيسية',
    navAlertes: 'التنبيهات',
    navObjets: 'الأشياء المعثور عليها',
    navRechercher: 'بحث',
    monCompte: 'حسابي',
    titre: 'إنشاء بلاغ',
    categorie: 'الفئة',
    localisation: 'الموقع',
    date: 'التاريخ',
    description: 'الوصف',
    ajouterPhoto: 'إضافة صورة',
    indiquezLieu: 'حدد المكان',
    publier: 'نشر',
    photoLabel: 'انقر أو اسحب صورة هنا',
    photoFormat: 'PNG, JPG, JPEG — الحد الأقصى 5MB',
    langFr: 'Français (France)',
    langAr: 'Arabic (Maroc)',
    langEn: 'English (UK)',
  },
  en: {
    navAccueil: 'Home',
    navAlertes: 'Alerts',
    navObjets: 'Found Items',
    navRechercher: 'Search',
    monCompte: 'My account',
    titre: 'Create a report',
    categorie: 'Category',
    localisation: 'Location',
    date: 'Date',
    description: 'Description',
    ajouterPhoto: 'Add an image',
    indiquezLieu: 'Indicate location',
    publier: 'Publish',
    photoLabel: 'Click or drag an image here',
    photoFormat: 'PNG, JPG, JPEG — max 5MB',
    langFr: 'Français (France)',
    langAr: 'Arabic (Maroc)',
    langEn: 'English (UK)',
  },
};

const HomePage = ({ signalement, onRetour, langue }) => {
  const t = translations[langue];
  return (
    <div className="cs-home-page">

      {/* HEADER */}
      <header className="cs-header">
        <div className="cs-header-inner">
          <div className="cs-logo">
        
            <div className="cs-logo-text">
              <div className="c">
                <img src="/11.jpeg" alt="logo" className="logo-img" />
              </div>
              <div className="cs-logo-divider" />
              <div className="cs-logo-tagline">TOGETHER,<br />WE FIND</div>
            </div>
          </div>
          <nav className="cs-nav">
            <a className="cs-nav-link cs-nav-active" href="#">{t.navAccueil}</a>
            <a className="cs-nav-link" href="#">{t.navAlertes}</a>
            <a className="cs-nav-link" href="#">{t.navObjets}</a>
            <a className="cs-nav-link" href="#">{t.navRechercher}</a>
          </nav>
          <div className="cs-account">
            <div className="cs-account-avatar">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#dbeafe"/>
                <circle cx="18" cy="14" r="6" fill="#93c5fd"/>
                <path d="M6 30c0-6 5-10 12-10s12 4 12 10" fill="#93c5fd"/>
              </svg>
            </div>
            <span className="cs-account-label">{t.monCompte}</span>
          </div>
        </div>
      </header>

      {/* CONTENU HOME */}
      <main className="cs-home-main">

        <div className="cs-home-success-banner">
          <span className="cs-home-success-icon">✅</span>
          <span className="cs-home-success-text">
            Signalement publié avec succès !
          </span>
        </div>

        <h1 className="cs-home-title">Signalements récents</h1>

        <div className="cs-home-cards">

          {/* CARTE DU NOUVEAU SIGNALEMENT */}
          <div className="cs-home-card cs-home-card-new">
            <div className="cs-home-card-badge">Nouveau</div>
            {signalement.imagePreview && (
              <img
                className="cs-home-card-img"
                src={signalement.imagePreview}
                alt="signalement"
              />
            )}
            <div className="cs-home-card-body">
              <div className="cs-home-card-categorie">{signalement.categorie || 'Sans catégorie'}</div>
              <div className="cs-home-card-desc">{signalement.description || 'Aucune description'}</div>
              <div className="cs-home-card-meta">
                <span className="cs-home-card-lieu">📍 {signalement.localisation || 'Non précisé'}</span>
                <span className="cs-home-card-date">🗓 {signalement.date || 'Non précisée'}</span>
              </div>
            </div>
          </div>

          {/* CARTES EXEMPLES */}
          <div className="cs-home-card">
            <div className="cs-home-card-body">
              <div className="cs-home-card-categorie">Objet perdu</div>
              <div className="cs-home-card-desc">Portefeuille noir perdu près de la gare</div>
              <div className="cs-home-card-meta">
                <span className="cs-home-card-lieu">📍 Casablanca</span>
                <span className="cs-home-card-date">🗓 10/04/2026</span>
              </div>
            </div>
          </div>

          <div className="cs-home-card">
            <div className="cs-home-card-body">
              <div className="cs-home-card-categorie">Animal perdu</div>
              <div className="cs-home-card-desc">Chat tigré perdu dans le quartier Agdal</div>
              <div className="cs-home-card-meta">
                <span className="cs-home-card-lieu">📍 Rabat</span>
                <span className="cs-home-card-date">🗓 11/04/2026</span>
              </div>
            </div>
          </div>

        </div>

        <button className="cs-home-retour-btn" onClick={onRetour}>
          + Créer un nouveau signalement
        </button>

      </main>

      {/* FOOTER LANGUES */}
      <footer className="cs-footer">
        <div className="cs-footer-inner">
          <span className="cs-footer-lang">{t.langFr}</span>
          <span className="cs-footer-lang cs-footer-lang-active">{t.langAr}</span>
          <span className="cs-footer-lang">{t.langEn}</span>
        </div>
      </footer>

    </div>
  );
};

const CreateSignalement = () => {
  const [langue, setLangue] = useState('ar');
  const [page, setPage] = useState('form');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    categorie: '',
    localisation: '',
    date: '',
    description: '',
  });

  const fileInputRef = useRef(null);
  const t = translations[langue];
  const isRTL = langue === 'ar';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageFile = (file) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    handleImageFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage('home');
  };

  if (page === 'home') {
    return (
      <HomePage
        signalement={{ ...formData, imagePreview }}
        langue={langue}
        onRetour={() => {
          setPage('form');
          setFormData({ categorie: '', localisation: '', date: '', description: '' });
          setImagePreview(null);
          setImageName('');
        }}
      />
    );
  }

  return (
    <div className="cs-page" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* HEADER */}
      <header className="cs-header">
        <div className="cs-header-inner">

          {/* LOGO */}
          <div className="cs-logo">
            <div className="cs-logo-icon">
            </div>

            <div className="cs-logo-text">
              < img
              src="/11.jpeg"
              alt='Logo'
              style={{
                height:'45px',
                width:'auto',
                display:'block',
                marginLeft:'10px'
              }}
              />
            </div>
          </div>

          {/* NAV */}
          <nav className="cs-nav">
            <a className="cs-nav-link cs-nav-active" href="home">{t.navAccueil}</a>
            <a className="cs-nav-link" href="alertes">{t.navAlertes}</a>
            <a className="cs-nav-link" href="#">{t.navObjets}</a>
            <a className="cs-nav-link" href="home">{t.navRechercher}</a>
          </nav>

          {/* MON COMPTE */}
          <div className="cs-account">
            <div className="cs-account-avatar">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#dbeafe"/>
                <circle cx="18" cy="14" r="6" fill="#93c5fd"/>
                <path d="M6 30c0-6 5-10 12-10s12 4 12 10" fill="#93c5fd"/>
              </svg>
            </div>
            <span className="cs-account-label">{t.monCompte}</span>
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="cs-main">
        <div className="cs-form-card">

          <h2 className="cs-form-title">{t.titre}</h2>

          <form className="cs-form" onSubmit={handleSubmit}>

            {/* CATÉGORIE */}
            <div className="cs-field cs-field-full">
              <input
                className="cs-input"
                type="text"
                name="categorie"
                placeholder={t.categorie}
                value={formData.categorie}
                onChange={handleChange}
              />
            </div>

            {/* LOCALISATION + DATE */}
            <div className="cs-field-row">
              <div className="cs-field">
                <input
                  className="cs-input"
                  type="text"
                  name="localisation"
                  placeholder={t.localisation}
                  value={formData.localisation}
                  onChange={handleChange}
                />
              </div>
              <div className="cs-field">
                <input
                  className="cs-input"
                  type="text"
                  name="date"
                  placeholder={t.date}
                  value={formData.date}
                  onChange={handleChange}
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="cs-field cs-field-full">
              <input
                className="cs-input"
                type="text"
                name="description"
                placeholder={t.description}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* ZONE IMAGE */}
            <div className="cs-field cs-field-full">
              {!imagePreview ? (
                <div
                  className={`cs-dropzone ${dragOver ? 'cs-dropzone-active' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <svg className="cs-dropzone-icon" width="32" height="32"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  <span className="cs-dropzone-label">{t.photoLabel}</span>
                  <span className="cs-dropzone-format">{t.photoFormat}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=""
                    className="cs-file-input"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="cs-image-preview-wrapper">
                  <img
                    className="cs-image-preview"
                    src={imagePreview}
                    alt="preview"
                  />
                  <div className="cs-image-preview-info">
                    <span className="cs-image-preview-name">{imageName}</span>
                    <button
                      type="button"
                      className="cs-image-remove-btn"
                      onClick={handleRemoveImage}
                    >
                      ✕ Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER FORM */}
            <div className="cs-form-footer">
              <button type="button" className="cs-location-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {t.indiquezLieu}
              </button>
              <button type="submit" className="cs-submit-btn">
                {t.publier}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* FOOTER LANGUES */}
      <footer className="cs-footer">
        <div className="cs-footer-inner">

          <button
            className={`cs-footer-lang ${langue === 'fr' ? 'cs-footer-lang-active' : ''}`}
            onClick={() => setLangue('fr')}
          >
            {t.langFr}
          </button>

          <span className="cs-footer-sep">·</span>

          <button
            className={`cs-footer-lang ${langue === 'ar' ? 'cs-footer-lang-active' : ''}`}
            onClick={() => setLangue('ar')}
          >
            {t.langAr}
          </button>

          <span className="cs-footer-sep">·</span>

          <button
            className={`cs-footer-lang ${langue === 'en' ? 'cs-footer-lang-active' : ''}`}
            onClick={() => setLangue('en')}
          >
            {t.langEn}
          </button>

        </div>
      </footer>

    </div>
  );
};

export default CreateSignalement;