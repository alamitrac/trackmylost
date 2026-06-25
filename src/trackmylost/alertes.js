import React, { useState } from 'react';
import './style.css';

const MapModal = ({ onClose, onConfirm }) => {
  const [adresse, setAdresse] = useState('');
  const [typeEndroit, setTypeEndroit] = useState('Tous');
  const [rayon, setRayon] = useState(500);
  const [mapMode, setMapMode] = useState('Standard');
  const [positionSelectionnee, setPositionSelectionnee] = useState(null);

  const typesEndroit = ['Tous', 'Transport', 'Commerce', 'Parc', 'École'];

  const handleMapClick = () => {
    setPositionSelectionnee({
      lat: '33.5731° N',
      lng: '7.5898° O',
      label: 'Casablanca, Maroc',
    });
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm(positionSelectionnee);
    if (onClose) onClose();
  };

  const formatRayon = (val) => {
    if (val >= 1000) return `${val / 1000} km`;
    return `${val} m`;
  };

  return (
    <div className="mm-overlay">
      <div className="mm-modal">

        {/* ── EN-TÊTE ── */}
        <div className="mm-header">
          <div className="mm-header-left">
            <div className="mm-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#ffffff" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="mm-header-texts">
              <h2 className="mm-header-title">Indiquer l'emplacement de perte</h2>
              <p className="mm-header-sub">
                Cliquez sur la carte ou recherchez une adresse pour marquer l'endroit
              </p>
            </div>
          </div>
          <button className="mm-close-btn" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── CORPS ── */}
        <div className="mm-body">

          {/* PANNEAU GAUCHE */}
          <div className="mm-left">

            {/* RECHERCHE ADRESSE */}
            <div className="mm-section">
              <label className="mm-section-label">RECHERCHER UNE ADRESSE</label>
              <div className="mm-search-wrapper">
                <svg className="mm-search-icon" width="13" height="13"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <input
                  className="mm-search-input"
                  type="text"
                  placeholder="Ex: Aïn Diab, Casablanca..."
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </div>
            </div>

            {/* TYPE D'ENDROIT */}
            <div className="mm-section">
              <label className="mm-section-label">TYPE D'ENDROIT</label>
              <div className="mm-types-grid">
                {typesEndroit.map((type) => (
                  <button
                    key={type}
                    className={`mm-type-btn ${typeEndroit === type ? 'mm-type-btn-active' : ''}`}
                    onClick={() => setTypeEndroit(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* RAYON DE RECHERCHE */}
            <div className="mm-section">
              <label className="mm-section-label">RAYON DE RECHERCHE</label>
              <div className="mm-rayon-row">
                <span className="mm-rayon-label">Zone approximative</span>
                <span className="mm-rayon-value">{formatRayon(rayon)}</span>
              </div>
              <input
                className="mm-rayon-slider"
                type="range"
                min="100"
                max="3000"
                step="100"
                value={rayon}
                onChange={(e) => setRayon(Number(e.target.value))}
              />
              <div className="mm-rayon-minmax">
                <span>100 m</span>
                <span>3 km</span>
              </div>
            </div>

            {/* POSITION SÉLECTIONNÉE */}
            <div className="mm-section">
              <label className="mm-section-label">POSITION SÉLECTIONNÉE</label>
              <div className="mm-position-box">
                {positionSelectionnee ? (
                  <div className="mm-position-content">
                    <div className="mm-position-dot mm-position-dot-active" />
                    <div className="mm-position-info">
                      <span className="mm-position-label-text">
                        {positionSelectionnee.label}
                      </span>
                      <span className="mm-position-coords">
                        {positionSelectionnee.lat} · {positionSelectionnee.lng}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mm-position-empty">
                    Aucune position sélectionnée
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* PANNEAU DROIT — CARTE */}
          <div className="mm-right">

            {/* TOGGLE STANDARD / SATELLITE */}
            <div className="mm-map-controls">
              <div className="mm-map-hint">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#f97316" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span className="mm-map-hint-text">
                  Cliquez sur la carte pour marquer l'endroit
                </span>
              </div>
              <div className="mm-map-toggle">
                <button
                  className={`mm-toggle-btn ${mapMode === 'Standard' ? 'mm-toggle-active' : ''}`}
                  onClick={() => setMapMode('Standard')}
                >
                  Standard
                </button>
                <button
                  className={`mm-toggle-btn ${mapMode === 'Satellite' ? 'mm-toggle-active' : ''}`}
                  onClick={() => setMapMode('Satellite')}
                >
                  Satellite
                </button>
              </div>
            </div>

            {/* CARTE SIMULÉE */}
            <div
              className={`mm-map ${mapMode === 'Satellite' ? 'mm-map-satellite' : ''}`}
              onClick={handleMapClick}
            >
              {/* GRILLE CARTE */}
              <div className="mm-map-grid">
                {/* ROUTES SIMULÉES */}
                <svg className="mm-map-svg" viewBox="0 0 400 300"
                  xmlns="http://www.w3.org/2000/svg">
                  {mapMode === 'Standard' ? (
                    <>
                      <rect width="400" height="300" fill="#e8ecef"/>
                      <rect x="0" y="80" width="400" height="12" fill="#fff" opacity="0.9"/>
                      <rect x="0" y="160" width="400" height="8" fill="#fff" opacity="0.8"/>
                      <rect x="0" y="230" width="400" height="6" fill="#fff" opacity="0.7"/>
                      <rect x="80" y="0" width="10" height="300" fill="#fff" opacity="0.9"/>
                      <rect x="200" y="0" width="14" height="300" fill="#fff" opacity="0.9"/>
                      <rect x="320" y="0" width="8" height="300" fill="#fff" opacity="0.7"/>
                      <rect x="20" y="100" width="50" height="40" rx="3" fill="#d1d5db"/>
                      <rect x="110" y="20" width="70" height="50" rx="3" fill="#d1d5db"/>
                      <rect x="220" y="100" width="80" height="50" rx="3" fill="#d1d5db"/>
                      <rect x="340" y="40" width="50" height="30" rx="3" fill="#d1d5db"/>
                      <rect x="20" y="180" width="40" height="35" rx="3" fill="#d1d5db"/>
                      <rect x="110" y="180" width="60" height="30" rx="3" fill="#d1d5db"/>
                      <rect x="230" y="185" width="70" height="25" rx="3" fill="#d1d5db"/>
                      <rect x="340" y="170" width="45" height="40" rx="3" fill="#d1d5db"/>
                      <ellipse cx="150" cy="240" rx="30" ry="20" fill="#bbf7d0" opacity="0.6"/>
                      <ellipse cx="300" cy="50" rx="20" ry="15" fill="#bbf7d0" opacity="0.6"/>
                    </>
                  ) : (
                    <>
                      <rect width="400" height="300" fill="#4a5568"/>
                      <rect x="0" y="80" width="400" height="12" fill="#718096" opacity="0.8"/>
                      <rect x="0" y="160" width="400" height="8" fill="#718096" opacity="0.6"/>
                      <rect x="80" y="0" width="10" height="300" fill="#718096" opacity="0.8"/>
                      <rect x="200" y="0" width="14" height="300" fill="#718096" opacity="0.8"/>
                      <rect x="20" y="100" width="50" height="40" rx="3" fill="#2d3748"/>
                      <rect x="110" y="20" width="70" height="50" rx="3" fill="#2d3748"/>
                      <rect x="220" y="100" width="80" height="50" rx="3" fill="#2d3748"/>
                      <ellipse cx="150" cy="240" rx="30" ry="20" fill="#276749" opacity="0.7"/>
                    </>
                  )}

                  {/* MARQUEUR */}
                  {positionSelectionnee && (
                    <g transform="translate(185, 120)">
                      <circle cx="0" cy="0" r="20" fill="#f97316" opacity="0.2"/>
                      <circle cx="0" cy="0" r="10" fill="#f97316" opacity="0.4"/>
                      <circle cx="0" cy="-14" r="8" fill="#f97316"/>
                      <path d="M0 -6 C-6 0 -6 6 0 12 C6 6 6 0 0 -6Z" fill="#f97316"/>
                      <circle cx="0" cy="-14" r="3" fill="#ffffff"/>
                    </g>
                  )}

                  {/* TEXTE CLIC */}
                  {!positionSelectionnee && (
                    <text x="200" y="155" textAnchor="middle"
                      fill={mapMode === 'Standard' ? '#94a3b8' : '#cbd5e1'}
                      fontSize="13" fontFamily="Segoe UI, sans-serif">
                      Cliquez pour marquer
                    </text>
                  )}
                </svg>
              </div>

              {/* OVERLAY CLIC */}
              <div className="mm-map-click-overlay" />
            </div>

          </div>
        </div>

        {/* ── PIED DE PAGE ── */}
        <div className="mm-footer">
          <div className="mm-footer-left">
            <div className="mm-footer-pin">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#f97316" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="mm-footer-status">
              {positionSelectionnee ? (
                <>
                  <span className="mm-footer-status-title">
                    {positionSelectionnee.label}
                  </span>
                  <span className="mm-footer-status-sub">
                    Position confirmée
                  </span>
                </>
              ) : (
                <>
                  <span className="mm-footer-status-title">
                    Aucun emplacement sélectionné
                  </span>
                  <span className="mm-footer-status-sub">
                    Cliquez sur la carte pour marquer votre position
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="mm-footer-actions">
            <button className="mm-cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button
              className={`mm-confirm-btn ${!positionSelectionnee ? 'mm-confirm-btn-disabled' : ''}`}
              onClick={handleConfirm}
              disabled={!positionSelectionnee}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Confirmer l'emplacement
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MapModal;