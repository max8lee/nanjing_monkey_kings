import React from 'react';
import { Trophy, Ticket, User, LogOut, ShieldCheck, LogIn } from 'lucide-react';

export default function Header({ 
    activeSeason, 
    setActiveSeason, 
    currentUser, 
    onOpenAuth,
    onOpenTicketModal, 
    onLogout 
}) {
    return (
        <header className="espn-team-header">
            <div className="team-identity">
                <img src="/assets/full-logo.webp" alt="Nanjing Monkey Kings Logo" className="header-logo" />
                <div className="identity-info">
                    <div className="league-meta">
                        VOLO BASKETBALL • <span id="current-season-badge">
                            {activeSeason === 'season1' ? 'SEASON 1 (MAY 18 - JUN 29 • 6 WEEKS)' : 'SEASON 2 (JUL 20 - SEP 7 • 7 WEEKS)'}
                        </span>
                    </div>
                    <h1>NANJING MONKEY KINGS</h1>
                    <div className="team-stats-row">
                        <span className="stat-pill">
                            <strong>{activeSeason === 'season1' ? '1-5' : '1-2'}</strong> Record
                        </span>
                        <span className="stat-pill highlight">
                            <strong>{activeSeason === 'season1' ? '8th Place' : '4th Place'}</strong> Volo Men's League
                        </span>
                        
                        {/* SEASON SELECTOR DROPDOWN */}
                        <div className="season-selector-wrapper">
                            <label htmlFor="season-select" className="season-label">SEASON:</label>
                            <select 
                                id="season-select" 
                                className="season-select-dropdown" 
                                value={activeSeason}
                                onChange={(e) => setActiveSeason(e.target.value)}
                            >
                                <option value="season2">Season 2 (Current • 7/20 - 9/07)</option>
                                <option value="season1">Season 1 (Historical • 5/18 - 6/29)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* HEADER ACTIONS & USER PROFILE */}
            <div className="header-actions">
                {currentUser ? (
                    <div className="user-profile-badge">
                        {currentUser.avatar ? (
                            <img src={currentUser.avatar} alt="User Avatar" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                        ) : (
                            <User size={16} className="gold-text" />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="user-name">{currentUser.name || 'Fan User'}</span>
                            {currentUser.provider && (
                                <span style={{ fontSize: '0.65rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <ShieldCheck size={10} /> {currentUser.provider}
                                </span>
                            )}
                        </div>
                        <span className="tokens-tag">
                            <Trophy size={14} /> {(currentUser.tokens || 1250).toLocaleString()} PTS
                        </span>
                        <button className="btn-icon-logout" title="Sign Out" onClick={onLogout}>
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button className="btn-hero-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }} onClick={onOpenAuth}>
                        <LogIn size={15} style={{ marginRight: '6px' }} /> SIGN IN / OAUTH
                    </button>
                )}
                <button className="btn-espn-gold" onClick={onOpenTicketModal}>
                    <Ticket size={16} /> Get Game Tickets
                </button>
            </div>
        </header>
    );
}
