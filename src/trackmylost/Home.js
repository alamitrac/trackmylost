// ============================================================
//  TRACKMYLOST — Home.jsx
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ═══════════════════════════════════════════════════════════
// ① TRADUCTIONS
// ═══════════════════════════════════════════════════════════
const T = {
  fr: {
    dir: "ltr", font: "'Nunito', sans-serif",
    menu_accueil: "Accueil", menu_alertes: "Alertes", menu_objets: "Objets Trouvés",
    search: "Rechercher un signalement, une ville...",
    signalements: "Signalements", contributions: "Contributions", reseau: "Réseau",
    nav_accueil: "Accueil", nav_urgentes: "Alertes urgentes", nav_objets: "Objets Trouvés",
    nav_carte: "Carte interactive", nav_messages: "Messagerie", nav_compte: "Mon compte",
    admin: "Admin Panel",
    f_tout: "Tout", f_urgence: "🔴 Urgence maximale", f_eleve: "🟠 Élevé",
    f_vehicule: "🔵 Véhicules", f_perdu: "🟢 Perdus / Trouvés",
    commenter: "Commenter", partager: "Partager", contacter: "Contacter",
    statistiques: "Statistiques", voir_tout: "Voir tout",
    urgences: "Urgences actives", disparus: "Disparus",
    vehicules: "Véhicules", objets_panel: "Objets trouvés",
    signalements_s: "signalements", disponibles: "disponibles",
    carte_titre: "Carte des alertes", ouvrir: "Ouvrir",
    voir_carte: "Voir la carte interactive", objets_recents: "Objets trouvés récents",
    urgence_max: "URGENCE MAXIMALE", urgence_elevee: "URGENCE ÉLEVÉE",
    vehicule_tag: "VÉHICULE", perdu_tag: "PERDU / TROUVÉ",
    aucun_resultat: "Aucun signalement pour ce filtre.",
    retour: "← Retour",
    stat_titre: "📊 Statistiques", stat_sous: "Vue d'ensemble de l'activité TrackMyLost",
    activite_hebdo: "Activité hebdomadaire", activite_sous: "Signalements par jour (7 derniers jours)",
    repartition: "Répartition par type", repartition_sous: "Distribution des signalements actifs",
    top_villes: "Top villes — signalements actifs", top_villes_sous: "Classement par nombre de signalements",
    taux_resolution: "Taux de résolution", taux_sous: "Cas résolus ce mois",
    signalements_recents: "Signalements récents", derniere_24h: "Dernières 24 heures",
    activite_recente: "Activité récente", ce_mois: "Ce mois-ci",
    objets_titre: "📦 Objets Trouvés", objets_sous: "52 objets disponibles au Maroc — Réclamez vos affaires",
    f_obj_tout: "Tout (52)", f_obj_docs: "📄 Documents", f_obj_elec: "📱 Électronique",
    f_obj_sac: "👜 Sacs & Portefeuilles", f_obj_cles: "🔑 Clés",
    obj_search: "Chercher un objet...",
    disponible: "● Disponible", reserve: "● Réservé",
    resume: "Résumé", par_cat: "Par catégorie", conseil: "Conseil",
    conseil_text: "💡 Si vous avez trouvé un objet, déposez-le dans le commissariat le plus proche et signalez-le ici pour le restituer rapidement.",
    total_objets: "Total objets", obj_dispo: "Disponibles", obj_reserve: "Réservés", obj_resolus: "Résolus ce mois",
    msg_titre: "💬 Messagerie", msg_sous: "Vos conversations privées",
    msg_search: "Rechercher une conversation...", msg_new: "Nouveau message",
    msg_envoi: "Envoyer", msg_placeholder: "Écrire un message...",
    msg_hier: "Hier", msg_online: "En ligne", msg_offline: "Hors ligne",
    compte_titre: "👤 Mon Compte", compte_sous: "Gérez votre profil et vos paramètres",
    compte_modifier: "Modifier le profil", compte_sauvegarder: "Sauvegarder",
    compte_annuler: "Annuler", compte_infos: "Informations personnelles",
    compte_securite: "Sécurité", compte_notif: "Notifications",
    compte_stats: "Mes statistiques", compte_activite: "Activité récente",
    compte_deconnexion: "Déconnexion",
    compte_nom: "Nom complet", compte_email: "Adresse email",
    compte_tel: "Téléphone", compte_ville: "Ville", compte_bio: "Bio",
    compte_mdp: "Mot de passe actuel", compte_mdp_new: "Nouveau mot de passe",
    compte_mdp_confirm: "Confirmer le mot de passe",
    compte_notif_email: "Notifications par email", compte_notif_sms: "Notifications SMS",
    compte_notif_urgence: "Alertes urgentes", compte_notif_resolve: "Cas résolus",
  },
  ar: {
    dir: "rtl", font: "'Cairo', sans-serif",
    menu_accueil: "الرئيسية", menu_alertes: "التنبيهات", menu_objets: "المفقودات",
    search: "ابحث عن بلاغ أو مدينة...",
    signalements: "البلاغات", contributions: "المساهمات", reseau: "الشبكة",
    nav_accueil: "الرئيسية", nav_urgentes: "تنبيهات عاجلة", nav_objets: "الأشياء المفقودة",
    nav_carte: "الخريطة التفاعلية", nav_messages: "الرسائل", nav_compte: "حسابي",
    admin: "لوحة الإدارة",
    f_tout: "الكل", f_urgence: "🔴 طوارئ قصوى", f_eleve: "🟠 مرتفع",
    f_vehicule: "🔵 مركبات", f_perdu: "🟢 مفقود / موجود",
    commenter: "تعليق", partager: "مشاركة", contacter: "تواصل",
    statistiques: "إحصائيات", voir_tout: "عرض الكل",
    urgences: "طوارئ نشطة", disparus: "مفقودون",
    vehicules: "مركبات", objets_panel: "أشياء موجودة",
    signalements_s: "بلاغ", disponibles: "متاح",
    carte_titre: "خريطة التنبيهات", ouvrir: "فتح",
    voir_carte: "عرض الخريطة التفاعلية", objets_recents: "أشياء موجودة حديثاً",
    urgence_max: "طوارئ قصوى", urgence_elevee: "طوارئ مرتفعة",
    vehicule_tag: "مركبة", perdu_tag: "مفقود / موجود",
    aucun_resultat: "لا توجد بلاغات لهذا الفلتر.",
    retour: "→ رجوع",
    stat_titre: "📊 إحصائيات", stat_sous: "نظرة عامة على نشاط TrackMyLost",
    activite_hebdo: "النشاط الأسبوعي", activite_sous: "البلاغات في آخر 7 أيام",
    repartition: "التوزيع حسب النوع", repartition_sous: "توزيع البلاغات النشطة",
    top_villes: "أكثر المدن بلاغات", top_villes_sous: "تصنيف حسب عدد البلاغات",
    taux_resolution: "معدل الحل", taux_sous: "الحالات المحلولة هذا الشهر",
    signalements_recents: "البلاغات الأخيرة", derniere_24h: "آخر 24 ساعة",
    activite_recente: "النشاط الأخير", ce_mois: "هذا الشهر",
    objets_titre: "📦 الأشياء المفقودة", objets_sous: "52 شيء متاح في المغرب",
    f_obj_tout: "الكل (52)", f_obj_docs: "📄 وثائق", f_obj_elec: "📱 إلكترونيات",
    f_obj_sac: "👜 حقائب", f_obj_cles: "🔑 مفاتيح",
    obj_search: "البحث عن شيء...",
    disponible: "● متاح", reserve: "● محجوز",
    resume: "ملخص", par_cat: "حسب الفئة", conseil: "نصيحة",
    conseil_text: "💡 إذا وجدت شيئاً، أودعه في أقرب مركز شرطة وسجّله هنا لإعادته بسرعة.",
    total_objets: "إجمالي الأشياء", obj_dispo: "متاح", obj_reserve: "محجوز", obj_resolus: "محلول هذا الشهر",
    msg_titre: "💬 الرسائل", msg_sous: "محادثاتك الخاصة",
    msg_search: "البحث في المحادثات...", msg_new: "رسالة جديدة",
    msg_envoi: "إرسال", msg_placeholder: "اكتب رسالة...",
    msg_hier: "أمس", msg_online: "متصل", msg_offline: "غير متصل",
    compte_titre: "👤 حسابي", compte_sous: "إدارة ملفك الشخصي",
    compte_modifier: "تعديل الملف", compte_sauvegarder: "حفظ",
    compte_annuler: "إلغاء", compte_infos: "المعلومات الشخصية",
    compte_securite: "الأمان", compte_notif: "الإشعارات",
    compte_stats: "إحصائياتي", compte_activite: "النشاط الأخير",
    compte_deconnexion: "تسجيل الخروج",
    compte_nom: "الاسم الكامل", compte_email: "البريد الإلكتروني",
    compte_tel: "الهاتف", compte_ville: "المدينة", compte_bio: "نبذة",
    compte_mdp: "كلمة المرور الحالية", compte_mdp_new: "كلمة المرور الجديدة",
    compte_mdp_confirm: "تأكيد كلمة المرور",
    compte_notif_email: "إشعارات البريد الإلكتروني", compte_notif_sms: "إشعارات SMS",
    compte_notif_urgence: "تنبيهات الطوارئ", compte_notif_resolve: "الحالات المحلولة",
  },
  en: {
    dir: "ltr", font: "'Nunito', sans-serif",
    menu_accueil: "Home", menu_alertes: "Alerts", menu_objets: "Found Items",
    search: "Search for a report, city...",
    signalements: "Reports", contributions: "Contributions", reseau: "Network",
    nav_accueil: "Home", nav_urgentes: "Urgent Alerts", nav_objets: "Found Objects",
    nav_carte: "Interactive Map", nav_messages: "Messaging", nav_compte: "My Account",
    admin: "Admin Panel",
    f_tout: "All", f_urgence: "🔴 Max Urgency", f_eleve: "🟠 High",
    f_vehicule: "🔵 Vehicles", f_perdu: "🟢 Lost / Found",
    commenter: "Comment", partager: "Share", contacter: "Contact",
    statistiques: "Statistics", voir_tout: "View all",
    urgences: "Active Emergencies", disparus: "Missing",
    vehicules: "Vehicles", objets_panel: "Found Objects",
    signalements_s: "reports", disponibles: "available",
    carte_titre: "Alerts Map", ouvrir: "Open",
    voir_carte: "View interactive map", objets_recents: "Recently Found Items",
    urgence_max: "MAXIMUM URGENCY", urgence_elevee: "HIGH URGENCY",
    vehicule_tag: "VEHICLE", perdu_tag: "LOST / FOUND",
    aucun_resultat: "No reports for this filter.",
    retour: "← Back",
    stat_titre: "📊 Statistics", stat_sous: "TrackMyLost activity overview",
    activite_hebdo: "Weekly activity", activite_sous: "Reports per day (last 7 days)",
    repartition: "Distribution by type", repartition_sous: "Active reports distribution",
    top_villes: "Top cities — active reports", top_villes_sous: "Ranked by number of reports",
    taux_resolution: "Resolution rate", taux_sous: "Cases resolved this month",
    signalements_recents: "Recent reports", derniere_24h: "Last 24 hours",
    activite_recente: "Recent activity", ce_mois: "This month",
    objets_titre: "📦 Found Items", objets_sous: "52 items available in Morocco",
    f_obj_tout: "All (52)", f_obj_docs: "📄 Documents", f_obj_elec: "📱 Electronics",
    f_obj_sac: "👜 Bags & Wallets", f_obj_cles: "🔑 Keys",
    obj_search: "Search an item...",
    disponible: "● Available", reserve: "● Reserved",
    resume: "Summary", par_cat: "By category", conseil: "Tip",
    conseil_text: "💡 If you found an item, drop it at the nearest police station and report it here so it can be returned quickly.",
    total_objets: "Total items", obj_dispo: "Available", obj_reserve: "Reserved", obj_resolus: "Resolved this month",
    msg_titre: "💬 Messaging", msg_sous: "Your private conversations",
    msg_search: "Search conversations...", msg_new: "New message",
    msg_envoi: "Send", msg_placeholder: "Write a message...",
    msg_hier: "Yesterday", msg_online: "Online", msg_offline: "Offline",
    compte_titre: "👤 My Account", compte_sous: "Manage your profile and settings",
    compte_modifier: "Edit profile", compte_sauvegarder: "Save",
    compte_annuler: "Cancel", compte_infos: "Personal information",
    compte_securite: "Security", compte_notif: "Notifications",
    compte_stats: "My statistics", compte_activite: "Recent activity",
    compte_deconnexion: "Sign out",
    compte_nom: "Full name", compte_email: "Email address",
    compte_tel: "Phone", compte_ville: "City", compte_bio: "Bio",
    compte_mdp: "Current password", compte_mdp_new: "New password",
    compte_mdp_confirm: "Confirm password",
    compte_notif_email: "Email notifications", compte_notif_sms: "SMS notifications",
    compte_notif_urgence: "Urgent alerts", compte_notif_resolve: "Resolved cases",
  },
};

const PROFILE = {
  initials: "YS", name: "Yassine Sardi", city: "Settat, Maroc",
  email: "yassine.sardi@email.ma", tel: "+212 6 12 34 56 78",
  bio: "Citoyen engagé pour la sécurité communautaire au Maroc.",
  signalements: 3, contributions: 12, reseau: 1,
};

const ALERTS_DATA = [
  { id:1, initials:"FB", user:"Fatima Benali", city:"Casablanca, Hay Hassani", time:"Il y a 2 heures", urgency:"max", title:"Enfant disparu — Adam Benali, 8 ans", desc:"Mon fils Adam a disparu ce matin vers 8h30 près de l'école Ibn Sina, quartier Hay Hassani. Il porte un pull bleu marine et un jean. Taille 1m25 environ.", tags:["Enfant","Hay Hassani","Matin"], comments:24 },
  { id:2, initials:"KF", user:"Karim El Fassi", city:"Rabat, Agdal", time:"Il y a 5 heures", urgency:"high", title:"Personne âgée disparue — Lalla Amina, 74 ans", desc:"Ma grand-mère souffre d'Alzheimer. Elle a quitté le domicile familial à Agdal ce matin. Elle porte un caftan vert et un foulard blanc.", tags:["Personne âgée","Agdal","Alzheimer"], comments:8 },
  { id:3, initials:"YT", user:"Youssef Tazi", city:"Marrakech, Guéliz", time:"Il y a 16 heures", urgency:"vehicle", title:"Véhicule volé — Dacia Logan grise 2019", desc:"Mon véhicule a été volé dans le parking du centre commercial Marjane Guéliz hier soir. Plaque: 42578-A-5. Dacia Logan grise, modèle 2019.", tags:["Véhicule","Marrakech","42578-A-5"], comments:3 },
  { id:4, initials:"SM", user:"Sara Mansouri", city:"Fès, Médina", time:"Il y a 1 heure", urgency:"lost", title:"Sac retrouvé contenant des papiers — Fès", desc:"J'ai trouvé un sac à main noir contenant une CIN, un permis de conduire et des clés. Retrouvé près de la place Batha à Fès.", tags:["Objet trouvé","Fès","CIN"], comments:5 },
];

const FOUND_ITEMS_PANEL = [
  { id:1, icon:"🎒", name:"Sac + Passeport",  location:"Fès - Agdal/Ville"  },
  { id:2, icon:"📱", name:"iPhone 15 Pro",     location:"Casablanca - Hier"  },
  { id:3, icon:"🔑", name:"Clé de voiture",    location:"Rabat - Il y a 4h"  },
  { id:4, icon:"👜", name:"Portefeuille CIN",  location:"Agadir - Il y a 4h" },
];

const FOUND_ITEMS_FULL = [
  { id:1, icon:"🎒", name:"Sac + Passeport marocain", location:"Fès, Agdal — Place Batha", time:"Il y a 1 heure", user:"Sara Mansouri", cat:"docs", status:"dispo", bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)", tags:["Passeport","Fès","Sac"] },
  { id:2, icon:"📱", name:"iPhone 15 Pro — Noir", location:"Casablanca, Hay Hassani", time:"Hier soir", user:"Mohammed Ait", cat:"elec", status:"dispo", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)", tags:["iPhone","Casa","Téléphone"] },
  { id:3, icon:"🔑", name:"Clé de voiture Renault", location:"Rabat, Agdal", time:"Il y a 4 heures", user:"Leila Bensouda", cat:"cles", status:"reserve", bg:"linear-gradient(135deg,#fff7ed,#ffedd5)", tags:["Clé","Renault","Rabat"] },
  { id:4, icon:"👜", name:"Portefeuille + CIN", location:"Agadir, Centre-ville", time:"Il y a 4 heures", user:"Fatima Cherkaoui", cat:"sac", status:"dispo", bg:"linear-gradient(135deg,#fdf4ff,#fae8ff)", tags:["Portefeuille","CIN","Agadir"] },
  { id:5, icon:"📋", name:"Permis de conduire", location:"Marrakech, Guéliz", time:"Il y a 6 heures", user:"Youssef Tazi", cat:"docs", status:"dispo", bg:"linear-gradient(135deg,#fefce8,#fef9c3)", tags:["Permis","Marrakech"] },
  { id:6, icon:"💻", name:"MacBook Air — Argenté", location:"Casablanca, Maârif", time:"Il y a 8 heures", user:"Hamid Berrada", cat:"elec", status:"dispo", bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)", tags:["MacBook","Casa","Laptop"] },
  { id:7, icon:"🎒", name:"Sac à dos Nike bleu", location:"Fès, Médina", time:"Il y a 10 heures", user:"Amine Alaoui", cat:"sac", status:"dispo", bg:"linear-gradient(135deg,#eff6ff,#dbeafe)", tags:["Sac","Nike","Fès"] },
  { id:8, icon:"🔑", name:"Trousseau de clés", location:"Rabat, Hassan", time:"Il y a 12 heures", user:"Nadia Tlemcani", cat:"cles", status:"dispo", bg:"linear-gradient(135deg,#fff7ed,#ffedd5)", tags:["Clés","Rabat"] },
  { id:9, icon:"📄", name:"CIN + Carte bancaire", location:"Settat, Centre", time:"Il y a 2 heures", user:"Karim Benali", cat:"docs", status:"dispo", bg:"linear-gradient(135deg,#fdf4ff,#fae8ff)", tags:["CIN","Carte","Settat"] },
];

const STATS = [
  { key:"urgences",     count:14, color:"#ef4444" },
  { key:"disparus",     count:27, color:"#f97316" },
  { key:"vehicules",    count:38, color:"#3b82f6" },
  { key:"objets_panel", count:52, color:"#22c55e", subKey:"disponibles" },
];

const MAP_MARKERS = [
  { lat:33.5731, lng:-7.5898, title:"Enfant disparu - Casablanca",  color:"#ef4444" },
  { lat:33.9716, lng:-6.8498, title:"Personne âgée - Rabat",        color:"#f97316" },
  { lat:31.6295, lng:-7.9811, title:"Véhicule volé - Marrakech",    color:"#3b82f6" },
  { lat:34.0333, lng:-5.0000, title:"Objet trouvé - Fès",           color:"#22c55e" },
];

// ═══════════════════════════════════════════════════════════
// COMPOSANT — Carte GPS Leaflet
// ═══════════════════════════════════════════════════════════
function MapGPS() {
  useEffect(() => {
    if (!document.getElementById("lf-css")) {
      const link = document.createElement("link");
      link.id = "lf-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    function init() {
      const el = document.getElementById("gps-map");
      if (!el || el._leaflet_id) return;
      const map = window.L.map("gps-map").setView([32.0, -6.5], 5);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution:"© OpenStreetMap" }).addTo(map);
      MAP_MARKERS.forEach(({ lat, lng, title, color }) => {
        const icon = window.L.divIcon({
          html:`<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 6px ${color}99"></div>`,
          className:"", iconSize:[12,12],
        });
        window.L.marker([lat, lng], { icon }).addTo(map).bindPopup(title);
      });
    }
    if (!document.getElementById("lf-js")) {
      const s = document.createElement("script");
      s.id = "lf-js"; s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = init; document.head.appendChild(s);
    } else if (window.L) { init(); }
  }, []);
  return <div id="gps-map" style={{ width:"100%", height:150, borderRadius:10, background:"#dde8f0" }} />;
}

const URGENCY_CFG = {
  max:     { labelKey:"urgence_max",    color:"#ef4444", bg:"#fff1f1", dot:"🔴" },
  high:    { labelKey:"urgence_elevee", color:"#f97316", bg:"#fff7ed", dot:"🟠" },
  vehicle: { labelKey:"vehicule_tag",   color:"#3b82f6", bg:"#eff6ff", dot:"🔵" },
  lost:    { labelKey:"perdu_tag",      color:"#16a34a", bg:"#f0fdf4", dot:"🟢" },
};

// ═══════════════════════════════════════════════════════════
// COMPOSANT — Carte d'alerte
// ═══════════════════════════════════════════════════════════
function AlertCard({ alert, t }) {
  const u = URGENCY_CFG[alert.urgency] || URGENCY_CFG.high;
  return (
    <div style={S.card}>
      <div style={S.cardHead}>
        <div style={S.avatar}>{alert.initials}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700 }}>{alert.user}</div>
          <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:10, display:"inline-block", color:u.color, background:u.bg, border:`1px solid ${u.color}44` }}>
            {u.dot} {t[u.labelKey]}
          </span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, fontSize:11, color:"#718096" }}>
          <span>⏱ {alert.time}</span>
          <span>📍 {alert.city}</span>
        </div>
      </div>
      <div style={{ padding:"0 16px 12px" }}>
        <div style={{ fontSize:14, fontWeight:800, marginBottom:6 }}>{alert.title}</div>
        <div style={{ fontSize:12.5, color:"#718096", lineHeight:1.6, marginBottom:10 }}>{alert.desc}</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {alert.tags.map(tag => (
            <span key={tag} style={{ fontSize:11, fontWeight:600, color:"#2d5a8e", background:"#eff6ff", padding:"3px 10px", borderRadius:10 }}>#{tag}</span>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:8, padding:"10px 16px 14px", borderTop:"1px solid #e2e8f0", flexWrap:"wrap" }}>
        <button style={S.btnGray}>💬 {t.commenter} ({alert.comments})</button>
        <button style={S.btnGray}>🔗 {t.partager}</button>
        <button style={{ ...S.btnGray, background:"#1e3a5f", color:"#fff", marginLeft:"auto" }}>📞 {t.contacter}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT — Sidebar  ← useNavigate ICI
// ═══════════════════════════════════════════════════════════
function Sidebar({ t, lang, setLang, activeNav, setActiveNav }) {
  const navigate = useNavigate(); // ← AJOUT

  const NAV = [
    { key:"accueil",  label:t.nav_accueil,  icon:"🏠", badge:false },
    { key:"alertes",  label:t.nav_urgentes, icon:"🚨", badge:true  },
    { key:"objets",   label:t.nav_objets,   icon:"📦", badge:false },
    { key:"carte",    label:t.nav_carte,    icon:"🗺️", badge:false },
    { key:"messages", label:t.nav_messages, icon:"💬", badge:true  },
    { key:"compte",   label:t.nav_compte,   icon:"👤", badge:false },
  ];

  // ← FONCTION DE NAVIGATION CORRIGÉE
  const handleNav = (key) => {
    if (key === "messages") {
      navigate("/message");
    } else if (key === "compte") {
      navigate("/moncompte");
    } else {
      setActiveNav(key);
    }
  };

  return (
    <aside style={S.sidebar}>
      <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:"1px solid #e2e8f0", boxShadow:"0 2px 8px #0000000d" }}>
        <div style={{ height:52, background:"linear-gradient(135deg,#1e3a5f,#2d5a8e)" }} />
        <div style={{ textAlign:"center", padding:"0 14px 14px" }}>
          <div style={{ ...S.avatar, width:50, height:50, margin:"-25px auto 8px", border:"3px solid #fff", boxShadow:"0 2px 8px #00000022" }}>{PROFILE.initials}</div>
          <div style={{ fontSize:13, fontWeight:700 }}>{PROFILE.name}</div>
          <div style={{ fontSize:11, color:"#718096", marginTop:2 }}>📍 {PROFILE.city}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:4, marginTop:12 }}>
            {[[PROFILE.signalements,t.signalements],[PROFILE.contributions,t.contributions],[PROFILE.reseau,t.reseau]].map(([n,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:15, fontWeight:800, color:"#1e3a5f" }}>{n}</div>
                <div style={{ fontSize:9, color:"#718096", textTransform:"uppercase", letterSpacing:.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav style={{ background:"#fff", borderRadius:14, padding:8, border:"1px solid #e2e8f0", boxShadow:"0 2px 8px #0000000d" }}>
        {NAV.map(item => (
          <button key={item.key}
            onClick={() => handleNav(item.key)} // ← CORRIGÉ
            style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:"none", cursor:"pointer", width:"100%", fontSize:13, fontWeight:600, fontFamily:"inherit", textAlign:"left", color:activeNav===item.key?"#1e3a5f":"#718096", background:activeNav===item.key?"#eff6ff":"transparent" }}>
            <span>{item.icon}</span>
            <span style={{ flex:1 }}>{item.label}</span>
            {item.badge && <span style={{ width:7, height:7, background:"#ef4444", borderRadius:"50%" }} />}
          </button>
        ))}
      </nav>

      <div style={{ background:"#fff", borderRadius:14, padding:12, border:"1px solid #e2e8f0", display:"flex", gap:6, justifyContent:"center" }}>
        {[["fr","Français"],["ar","العربية"],["en","English"]].map(([c,l]) => (
          <button key={c} onClick={() => setLang(c)}
            style={{ padding:"4px 10px", borderRadius:20, fontFamily:"inherit", border:`1.5px solid ${lang===c?"#1e3a5f":"#e2e8f0"}`, background:lang===c?"#1e3a5f":"none", color:lang===c?"#fff":"#718096", fontSize:11, fontWeight:700, cursor:"pointer" }}>
            {l}
          </button>
        ))}
      </div>
      <button style={{ textAlign:"center", fontSize:11, color:"#718096", fontWeight:700, background:"none", border:"none", cursor:"pointer", padding:6, fontFamily:"inherit" }}>{t.admin}</button>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT — Topbar  ← useNavigate ICI
// ═══════════════════════════════════════════════════════════
function Topbar({ t, search, setSearch, activeNav, setActiveNav }) {
  const navigate = useNavigate(); // ← AJOUT

  return (
    <nav style={S.topbar}>
      <div>
        <img src="/11.jpeg" alt="Logo" style={{ height:"45px", width:"auto", display:"block", marginLeft:"10px" }} />
      </div>
      <div style={S.searchBox}>
        <span style={{ color:"rgba(255,255,255,.6)", fontSize:14 }}>🔍</span>
        <input style={S.searchInput} placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ display:"flex", gap:2, marginLeft:"auto" }}>
        {[
          { key:"accueil", label:t.menu_accueil, dot:false },
          { key:"alertes", label:t.menu_alertes, dot:true  },
          { key:"objets",  label:t.menu_objets,  dot:false },
        ].map(({key,label,dot}) => (
          <button key={key} onClick={() => setActiveNav(key)}
            style={{ ...S.topLink, ...(activeNav===key?S.topLinkOn:{}), border:"none", cursor:"pointer", fontFamily:"inherit" }}>
            {label}
            {dot && <span style={{ width:6, height:6, background:"#ef4444", borderRadius:"50%", display:"inline-block" }} />}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:12 }}>
        <button style={S.iconBtn}>🔔</button>

        {/* ✉️ → navigate vers /message */}
        <button style={S.iconBtn} onClick={() => navigate("/message")}>✉️</button>

        {/* Avatar → navigate vers /moncompte */}
        <div style={{ ...S.userDot, cursor:"pointer" }} onClick={() => navigate("/moncompte")}>
          {PROFILE.initials}
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE — OBJETS TROUVÉS
// ═══════════════════════════════════════════════════════════
function FoundItemCard({ item, t }) {
  const dispo = item.status === "dispo";
  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", boxShadow:"0 2px 8px #0000000d", overflow:"hidden" }}>
      <div style={{ height:110, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, background:item.bg, position:"relative" }}>
        {item.icon}
        <span style={{ position:"absolute", top:10, right:10, padding:"3px 10px", borderRadius:10, fontSize:10, fontWeight:700, color:dispo?"#16a34a":"#f97316", background:dispo?"#f0fdf4":"#fff7ed", border:`1px solid ${dispo?"#16a34a40":"#f9731640"}` }}>
          {dispo ? t.disponible : t.reserve}
        </span>
      </div>
      <div style={{ padding:"12px 14px" }}>
        <div style={{ fontSize:13, fontWeight:800, marginBottom:4 }}>{item.name}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:10 }}>
          <span style={{ fontSize:11, color:"#718096" }}>📍 {item.location}</span>
          <span style={{ fontSize:11, color:"#718096" }}>🕐 {item.time}</span>
          <span style={{ fontSize:11, color:"#718096" }}>👤 {item.user}</span>
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
          {item.tags.map(tag => <span key={tag} style={{ fontSize:10, fontWeight:600, color:"#2d5a8e", background:"#eff6ff", padding:"2px 8px", borderRadius:8 }}>#{tag}</span>)}
        </div>
        <div style={{ display:"flex", gap:6, paddingTop:10, borderTop:"1px solid #f1f5f9" }}>
          <button style={{ ...S.btnGray, flex:1, fontSize:11 }}>💬 {t.commenter}</button>
          <button style={{ ...S.btnGray, flex:1, fontSize:11, background:"#1e3a5f", color:"#fff" }}>📞 {t.contacter}</button>
        </div>
      </div>
    </div>
  );
}

function FoundItemsPage({ t, setActiveNav }) {
  const [activeFilter, setActiveFilter] = useState("tout");
  const [objSearch, setObjSearch] = useState("");
  const OBJ_FILTERS = [
    { key:"tout", label:t.f_obj_tout, color:"#1e3a5f" },
    { key:"docs", label:t.f_obj_docs, color:"#16a34a" },
    { key:"elec", label:t.f_obj_elec, color:"#3b82f6" },
    { key:"sac",  label:t.f_obj_sac,  color:"#f97316" },
    { key:"cles", label:t.f_obj_cles, color:"#1e3a5f" },
  ];
  const visible = FOUND_ITEMS_FULL.filter(item => {
    const catOk = activeFilter === "tout" || item.cat === activeFilter;
    const q = objSearch.toLowerCase();
    const searchOk = !q || item.name.toLowerCase().includes(q) || item.location.toLowerCase().includes(q) || item.tags.some(tag => tag.toLowerCase().includes(q));
    return catOk && searchOk;
  });
  return (
    <main style={{ flex:1, minWidth:0 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:"#1e3a5f" }}>{t.objets_titre}</div>
          <div style={{ fontSize:12, color:"#718096", marginTop:2 }}>{t.objets_sous}</div>
        </div>
        <button onClick={() => setActiveNav("accueil")} style={{ ...S.btnGray, padding:"8px 16px", borderRadius:20 }}>{t.retour}</button>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        {OBJ_FILTERS.map(f => {
          const isActive = activeFilter === f.key;
          return (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              style={{ padding:"7px 16px", borderRadius:20, fontFamily:"inherit", border:isActive?`2px solid ${f.color}`:"1.5px solid #e2e8f0", background:isActive?f.color:"#fff", color:isActive?"#fff":"#718096", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all .15s", boxShadow:isActive?`0 2px 10px ${f.color}55`:"none" }}>
              {f.label}
            </button>
          );
        })}
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:20, padding:"6px 14px", marginLeft:"auto" }}>
          <span style={{ fontSize:12 }}>🔍</span>
          <input value={objSearch} onChange={e => setObjSearch(e.target.value)} placeholder={t.obj_search}
            style={{ border:"none", outline:"none", fontSize:12, fontFamily:"inherit", color:"#1a202c", width:140, background:"transparent" }} />
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {visible.map(item => <FoundItemCard key={item.id} item={item} t={t} />)}
        {visible.length === 0 && <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:"#94a3b8", fontSize:14 }}>😔 {t.aucun_resultat}</div>}
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE — STATISTIQUES
// ═══════════════════════════════════════════════════════════
function StatisticsPage({ t, setActiveNav }) {
  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const gaugeRef = useRef(null);
  useEffect(() => {
    function loadChartJS(cb) {
      if (window.Chart) { cb(); return; }
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
      s.onload = cb; document.head.appendChild(s);
    }
    loadChartJS(() => {
      if (lineRef.current && !lineRef.current._chart) {
        lineRef.current._chart = new window.Chart(lineRef.current, {
          type:"line",
          data:{ labels:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"], datasets:[
            { label:"Signalements", data:[8,14,11,19,15,22,17], borderColor:"#1e3a5f", backgroundColor:"rgba(30,58,95,.08)", borderWidth:2, pointBackgroundColor:"#1e3a5f", pointRadius:4, fill:true, tension:.4 },
            { label:"Résolus", data:[5,10,9,14,12,18,14], borderColor:"#22c55e", backgroundColor:"rgba(34,197,94,.06)", borderWidth:2, pointBackgroundColor:"#22c55e", pointRadius:4, fill:true, tension:.4 },
          ]},
          options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, grid:{ color:"rgba(0,0,0,.05)" }, ticks:{ font:{ size:10 } } }, x:{ grid:{ display:false }, ticks:{ font:{ size:10 } } } } }
        });
      }
      if (donutRef.current && !donutRef.current._chart) {
        donutRef.current._chart = new window.Chart(donutRef.current, {
          type:"doughnut",
          data:{ labels:["Urgences","Disparus","Véhicules","Objets"], datasets:[{ data:[14,27,38,52], backgroundColor:["#ef4444","#f97316","#3b82f6","#22c55e"], borderWidth:0, hoverOffset:4 }] },
          options:{ responsive:false, cutout:"70%", plugins:{ legend:{ display:false } } }
        });
      }
      if (gaugeRef.current && !gaugeRef.current._chart) {
        gaugeRef.current._chart = new window.Chart(gaugeRef.current, {
          type:"doughnut",
          data:{ labels:["Résolus","Restants"], datasets:[{ data:[68,32], backgroundColor:["#22c55e","#f1f5f9"], borderWidth:0 }] },
          options:{ responsive:false, cutout:"72%", plugins:{ legend:{ display:false } }, rotation:-90, circumference:180 }
        });
      }
    });
  }, []);
  const BARS = [
    { label:"Casablanca", val:42, pct:90, color:"#1e3a5f" },
    { label:"Rabat", val:29, pct:65, color:"#2d5a8e" },
    { label:"Marrakech", val:22, pct:50, color:"#3b82f6" },
    { label:"Fès", val:17, pct:38, color:"#60a5fa" },
    { label:"Agadir", val:11, pct:25, color:"#93c5fd" },
    { label:"Settat", val:8, pct:18, color:"#bfdbfe" },
  ];
  const RECENT_REPORTS = [
    { title:"Enfant disparu — Adam Benali, 8 ans", city:"Casablanca", type:"max", status:"En cours", ago:"2h" },
    { title:"Personne âgée disparue — Lalla Amina", city:"Rabat", type:"high", status:"En cours", ago:"5h" },
    { title:"Véhicule volé — Dacia Logan grise", city:"Marrakech", type:"vehicle", status:"En cours", ago:"16h" },
    { title:"Sac retrouvé avec papiers", city:"Fès", type:"lost", status:"Résolu", ago:"1h" },
  ];
  const TYPE_BADGE = {
    max:     { label:"🔴 Urgence max", color:"#ef4444", bg:"#fff1f1", border:"#ef444440" },
    high:    { label:"🟠 Élevé", color:"#f97316", bg:"#fff7ed", border:"#f9731640" },
    vehicle: { label:"🔵 Véhicule", color:"#3b82f6", bg:"#eff6ff", border:"#3b82f640" },
    lost:    { label:"🟢 Objet trouvé", color:"#16a34a", bg:"#f0fdf4", border:"#16a34a40" },
  };
  return (
    <main style={{ flex:1, minWidth:0 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:"#1e3a5f" }}>{t.stat_titre}</div>
          <div style={{ fontSize:12, color:"#718096", marginTop:2 }}>{t.stat_sous}</div>
        </div>
        <button onClick={() => setActiveNav("accueil")} style={{ ...S.btnGray, padding:"8px 16px", borderRadius:20 }}>{t.retour}</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:t.urgences, val:14, color:"#ef4444", sub:t.signalements_s, trend:"↑ +3 aujourd'hui", up:true },
          { label:t.disparus, val:27, color:"#f97316", sub:"personnes", trend:"↑ +2 cette semaine", up:true },
          { label:t.vehicules, val:38, color:"#3b82f6", sub:t.signalements_s, trend:"↓ -1 cette semaine", up:false },
          { label:t.objets_panel, val:52, color:"#22c55e", sub:t.disponibles, trend:"↑ +8 cette semaine", up:true },
        ].map(kpi => (
          <div key={kpi.label} style={{ background:"#fff", borderRadius:14, padding:"16px 14px", border:"1px solid #e2e8f0", boxShadow:"0 2px 8px #0000000d" }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:kpi.color, marginBottom:10 }} />
            <div style={{ fontSize:10, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>{kpi.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:kpi.color }}>{kpi.val}</div>
            <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>{kpi.sub}</div>
            <div style={{ fontSize:11, fontWeight:700, marginTop:6, color:kpi.up?"#22c55e":"#ef4444" }}>{kpi.trend}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        <div style={{ background:"#fff", borderRadius:14, padding:16, border:"1px solid #e2e8f0", boxShadow:"0 2px 8px #0000000d" }}>
          <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:.5, color:"#1a202c", marginBottom:4 }}>{t.activite_hebdo}</div>
          <div style={{ fontSize:11, color:"#94a3b8", marginBottom:14 }}>{t.activite_sous}</div>
          <div style={{ display:"flex", gap:14, marginBottom:10 }}>
            {[["#1e3a5f","Signalements"],["#22c55e","Résolus"]].map(([c,l]) => (
              <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#718096" }}>
                <span style={{ width:10, height:10, borderRadius:2, background:c, display:"inline-block" }} />{l}
              </span>
            ))}
          </div>
          <div style={{ position:"relative", height:150 }}><canvas ref={lineRef} /></div>
        </div>
        <div style={{ background:"#fff", borderRadius:14, padding:16, border:"1px solid #e2e8f0", boxShadow:"0 2px 8px #0000000d" }}>
          <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:.5, color:"#1a202c", marginBottom:4 }}>{t.repartition}</div>
          <div style={{ fontSize:11, color:"#94a3b8", marginBottom:14 }}>{t.repartition_sous}</div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ position:"relative", width:130, height:130, flexShrink:0 }}>
              <canvas ref={donutRef} width="130" height="130" />
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:"#1e3a5f" }}>131</div>
                <div style={{ fontSize:10, color:"#94a3b8" }}>total</div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[["#ef4444","Urgences",14],["#f97316","Disparus",27],["#3b82f6","Véhicules",38],["#22c55e","Objets",52]].map(([c,l,v]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:c, flexShrink:0 }} />
                  <span style={{ flex:1, color:"#718096" }}>{l}</span>
                  <span style={{ fontWeight:700, color:"#1e3a5f" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:14, marginBottom:16 }}>
        <div style={{ background:"#fff", borderRadius:14, padding:16, border:"1px solid #e2e8f0", boxShadow:"0 2px 8px #0000000d" }}>
          <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:.5, color:"#1a202c", marginBottom:4 }}>{t.top_villes}</div>
          <div style={{ fontSize:11, color:"#94a3b8", marginBottom:14 }}>{t.top_villes_sous}</div>
          {BARS.map(bar => (
            <div key={bar.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:11, color:"#718096", width:80, flexShrink:0, textAlign:"right" }}>{bar.label}</span>
              <div style={{ flex:1, height:10, background:"#f1f5f9", borderRadius:10, overflow:"hidden" }}>
                <div style={{ width:`${bar.pct}%`, height:"100%", borderRadius:10, background:bar.color }} />
              </div>
              <span style={{ fontSize:11, fontWeight:700, width:28, textAlign:"right", color:bar.color }}>{bar.val}</span>
            </div>
          ))}
        </div>
        <div style={{ background:"#fff", borderRadius:14, padding:16, border:"1px solid #e2e8f0", boxShadow:"0 2px 8px #0000000d" }}>
          <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:.5, color:"#1a202c", marginBottom:4 }}>{t.taux_resolution}</div>
          <div style={{ fontSize:11, color:"#94a3b8", marginBottom:14 }}>{t.taux_sous}</div>
          <div style={{ position:"relative", width:130, height:130, margin:"0 auto 14px" }}>
            <canvas ref={gaugeRef} width="130" height="130" />
            <div style={{ position:"absolute", top:"55%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:"#22c55e" }}>68%</div>
              <div style={{ fontSize:10, color:"#94a3b8" }}>résolu</div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[["#22c55e","Résolus",89],["#f1f5f9","En cours",42]].map(([c,l,v]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c, border:"1px solid #e2e8f0", flexShrink:0 }} />
                <span style={{ flex:1, color:"#718096" }}>{l}</span>
                <span style={{ fontWeight:700, color:"#1e3a5f" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background:"#fff", borderRadius:14, padding:16, border:"1px solid #e2e8f0", boxShadow:"0 2px 8px #0000000d" }}>
        <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:.5, color:"#1a202c", marginBottom:14 }}>{t.signalements_recents}</div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr>{["Signalement","Ville","Type","Statut","Il y a"].map(h => (
              <th key={h} style={{ textAlign:"left", padding:"8px 10px", color:"#94a3b8", fontSize:10, textTransform:"uppercase", letterSpacing:.5, borderBottom:"1px solid #e2e8f0", fontWeight:700 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {RECENT_REPORTS.map((r,i) => {
              const tb = TYPE_BADGE[r.type];
              const isOk = r.status === "Résolu";
              return (
                <tr key={i}>
                  <td style={{ padding:"10px", borderBottom:"1px solid #f1f5f9", fontWeight:600 }}>{r.title}</td>
                  <td style={{ padding:"10px", borderBottom:"1px solid #f1f5f9", color:"#718096" }}>{r.city}</td>
                  <td style={{ padding:"10px", borderBottom:"1px solid #f1f5f9" }}>
                    <span style={{ padding:"3px 10px", borderRadius:10, fontSize:10, fontWeight:700, color:tb.color, background:tb.bg, border:`1px solid ${tb.border}` }}>{tb.label}</span>
                  </td>
                  <td style={{ padding:"10px", borderBottom:"1px solid #f1f5f9" }}>
                    <span style={{ padding:"3px 10px", borderRadius:10, fontSize:10, fontWeight:700, color:isOk?"#16a34a":"#f97316", background:isOk?"#f0fdf4":"#fff7ed", border:`1px solid ${isOk?"#16a34a40":"#f9731640"}` }}>{r.status}</span>
                  </td>
                  <td style={{ padding:"10px", borderBottom:"1px solid #f1f5f9", color:"#94a3b8" }}>{r.ago}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE — ACCUEIL
// ═══════════════════════════════════════════════════════════
function HomePage({ t, search, setActiveNav }) {
  const [activeFilter, setActiveFilter] = useState("tout");
  const [alerts, setAlerts] = useState(ALERTS_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const loadAxios = () => {
      if (window.axios) return Promise.resolve(window.axios);
      return new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js";
        s.onload = () => res(window.axios); s.onerror = rej;
        document.head.appendChild(s);
      });
    };
    loadAxios()
      .then(axios => axios.get("https://jsonplaceholder.typicode.com/posts?_limit=4"))
      .then(() => { if (!cancelled) setAlerts(ALERTS_DATA); })
      .catch(() => { if (!cancelled) setAlerts(ALERTS_DATA); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const FILTER_TO_URGENCY = { tout:null, urgence:"max", eleve:"high", vehicule:"vehicle", perdu:"lost" };
  const FILTERS = [
    { key:"tout",     label:t.f_tout,    color:"#1e3a5f" },
    { key:"urgence",  label:t.f_urgence, color:"#ef4444" },
    { key:"eleve",    label:t.f_eleve,   color:"#f97316" },
    { key:"vehicule", label:t.f_vehicule,color:"#3b82f6" },
    { key:"perdu",    label:t.f_perdu,   color:"#16a34a" },
  ];
  const visible = alerts.filter(a => {
    const urgencyOk = !FILTER_TO_URGENCY[activeFilter] || a.urgency === FILTER_TO_URGENCY[activeFilter];
    const searchOk  = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase());
    return urgencyOk && searchOk;
  });

  return (
    <>
      <main style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          {FILTERS.map(f => {
            const isActive = activeFilter === f.key;
            return (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                style={{ padding:"7px 16px", borderRadius:20, fontFamily:"inherit", border:isActive?`2px solid ${f.color}`:"1.5px solid #e2e8f0", background:isActive?f.color:"#fff", color:isActive?"#fff":"#718096", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all .15s", boxShadow:isActive?`0 2px 10px ${f.color}55`:"none" }}>
                {f.label}
              </button>
            );
          })}
        </div>
        {loading ? (
          <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>⏳ Chargement...</div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, color:"#94a3b8", fontSize:14 }}>😔 {t.aucun_resultat}</div>
        ) : (
          visible.map(a => <AlertCard key={a.id} alert={a} t={t} />)
        )}
      </main>
      <aside style={{ width:195, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>
        <div style={S.panelCard}>
          <div style={S.panelTitle}>
            {t.statistiques}
            <button onClick={() => setActiveNav("stats")} style={{ fontSize:11, color:"#1e3a5f", background:"none", border:"none", cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>{t.voir_tout}</button>
          </div>
          {STATS.map(s => (
            <div key={s.key} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:s.color, flexShrink:0 }} />
              <div>
                <div style={{ fontSize:10, color:"#94a3b8" }}>{t[s.key]}</div>
                <div style={{ fontSize:14, fontWeight:800 }}>{s.count} <span style={{ fontSize:10, fontWeight:400, color:"#94a3b8" }}>{t[s.subKey||"signalements_s"]}</span></div>
              </div>
            </div>
          ))}
        </div>
        <div style={S.panelCard}>
          <div style={S.panelTitle}>{t.carte_titre}</div>
          <MapGPS />
          <a href="/alertes" style={{ display:"block", textAlign:"center", marginTop:8, fontSize:11, fontWeight:700, color:"#1e3a5f", textDecoration:"none", padding:6, borderRadius:8, background:"#eff6ff" }}>
            🗺️ {t.voir_carte}
          </a>
        </div>
        <div style={S.panelCard}>
          <div style={S.panelTitle}>
            {t.objets_recents}
            <button onClick={() => setActiveNav("objets")} style={{ fontSize:11, color:"#1e3a5f", background:"none", border:"none", cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>{t.voir_tout}</button>
          </div>
          {FOUND_ITEMS_PANEL.map(item => (
            <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:"1px solid #e2e8f0" }}>
              <div style={{ width:30, height:30, borderRadius:8, background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize:11, fontWeight:700 }}>{item.name}</div>
                <div style={{ fontSize:10, color:"#94a3b8" }}>{item.location}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// APP PRINCIPALE — Home.jsx
// ═══════════════════════════════════════════════════════════
export default function Home() {
  const [lang,      setLang]      = useState("fr");
  const [activeNav, setActiveNav] = useState("accueil");
  const [search,    setSearch]    = useState("");
  const t = T[lang];

  const StatRightPanel = () => (
    <aside style={{ width:195, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>
      <div style={S.panelCard}>
        <div style={S.panelTitle}>{t.activite_recente}</div>
        {[
          { color:"#ef4444", text:"Nouveau signalement urgent — Adam Benali, Casablanca", time:"Il y a 2h" },
          { color:"#22c55e", text:"Cas résolu — Portefeuille retrouvé à Agadir", time:"Il y a 3h" },
          { color:"#f97316", text:"Mise à jour — Personne âgée disparue, Rabat", time:"Il y a 5h" },
          { color:"#3b82f6", text:"Véhicule signalé — Dacia Logan, Marrakech", time:"Il y a 16h" },
          { color:"#22c55e", text:"Objet déposé — iPhone 15 Pro, Casablanca", time:"Hier" },
        ].map((a,i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:a.color, marginTop:4, flexShrink:0 }} />
            <div>
              <div style={{ fontSize:11, color:"#718096", lineHeight:1.5 }}>{a.text}</div>
              <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={S.panelCard}>
        <div style={S.panelTitle}>{t.ce_mois}</div>
        {[["Nouveaux signalements","131","#1e3a5f"],["Cas résolus","89","#22c55e"],["Contributeurs actifs","247","#3b82f6"],["Villes couvertes","18","#f97316"]].map(([l,v,c]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:11, color:"#718096" }}>{l}</span>
            <span style={{ fontSize:14, fontWeight:800, color:c }}>{v}</span>
          </div>
        ))}
      </div>
    </aside>
  );

  const ObjRightPanel = () => (
    <aside style={{ width:195, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>
      <div style={S.panelCard}>
        <div style={S.panelTitle}>{t.resume}</div>
        {[[t.total_objets,"52","#1e3a5f"],[t.obj_dispo,"44","#22c55e"],[t.obj_reserve,"8","#f97316"],[t.obj_resolus,"31","#3b82f6"]].map(([l,v,c]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:11, color:"#718096" }}>{l}</span>
            <span style={{ fontSize:14, fontWeight:800, color:c }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={S.panelCard}>
        <div style={S.panelTitle}>{t.par_cat}</div>
        {[["📄 Documents","18"],["📱 Électronique","12"],["👜 Sacs","10"],["🔑 Clés","7"],["Autres","5"]].map(([l,v]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:11, color:"#718096" }}>{l}</span>
            <span style={{ fontSize:14, fontWeight:800, color:"#1e3a5f" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ ...S.panelCard, background:"#eff6ff", border:"1px solid #bfdbfe" }}>
        <div style={{ fontSize:12, fontWeight:800, color:"#1e3a5f", marginBottom:8 }}>{t.conseil}</div>
        <div style={{ fontSize:11, color:"#2d5a8e", lineHeight:1.5 }}>{t.conseil_text}</div>
      </div>
    </aside>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ ...S.root, fontFamily:t.font }} dir={t.dir}>
        <Topbar t={t} search={search} setSearch={setSearch} activeNav={activeNav} setActiveNav={setActiveNav} />
        <div style={S.body}>
          <Sidebar t={t} lang={lang} setLang={setLang} activeNav={activeNav} setActiveNav={setActiveNav} />
          {activeNav === "stats" ? (
            <><StatisticsPage t={t} setActiveNav={setActiveNav} /><StatRightPanel /></>
          ) : activeNav === "objets" ? (
            <><FoundItemsPage t={t} setActiveNav={setActiveNav} /><ObjRightPanel /></>
          ) : (
            <HomePage t={t} search={search} setActiveNav={setActiveNav} />
          )}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════
const C = {
  primary:"#1e3a5f", bg:"#f0f4f8", card:"#ffffff", border:"#e2e8f0", text:"#1a202c", muted:"#718096",
};
const S = {
  root:      { background:C.bg, minHeight:"100vh", color:C.text },
  topbar:    { height:60, background:C.primary, display:"flex", alignItems:"center", padding:"0 20px", gap:14, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px #00000033" },
  searchBox: { display:"flex", alignItems:"center", background:"rgba(255,255,255,.13)", border:"1px solid rgba(255,255,255,.25)", borderRadius:24, padding:"6px 14px", gap:8, width:260, flexShrink:0 },
  searchInput:{ background:"none", border:"none", outline:"none", color:"#fff", fontSize:12, width:"100%", fontFamily:"inherit" },
  topLink:   { color:"rgba(255,255,255,.75)", textDecoration:"none", fontSize:13, fontWeight:600, padding:"7px 14px", borderRadius:20, display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" },
  topLinkOn: { background:"rgba(255,255,255,.2)", color:"#ffffff" },
  iconBtn:   { background:"rgba(255,255,255,.12)", border:"none", cursor:"pointer", width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 },
  userDot:   { width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#667eea,#764ba2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700 },
  body:      { display:"flex", maxWidth:1280, margin:"0 auto", padding:"20px 14px", gap:16 },
  sidebar:   { width:210, flexShrink:0, display:"flex", flexDirection:"column", gap:12 },
  avatar:    { width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#667eea,#764ba2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:700, flexShrink:0 },
  card:      { background:C.card, borderRadius:14, marginBottom:14, border:`1px solid ${C.border}`, boxShadow:"0 2px 8px #0000000d", overflow:"hidden" },
  cardHead:  { display:"flex", alignItems:"flex-start", gap:10, padding:"14px 16px 10px", flexWrap:"wrap" },
  btnGray:   { padding:"7px 13px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, background:"#f1f5f9", color:"#475569", fontFamily:"inherit" },
  panelCard: { background:C.card, borderRadius:14, padding:14, border:`1px solid ${C.border}`, boxShadow:"0 2px 8px #0000000d" },
  panelTitle:{ fontSize:11, fontWeight:800, color:C.text, textTransform:"uppercase", letterSpacing:.5, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" },
};
