import React, { useMemo } from 'react';
import { Trophy, Ticket, User, LogOut, ShieldCheck, LogIn, ArrowRight } from 'lucide-react';
import { DATA_STANDINGS_SEASON1, DATA_STANDINGS_SEASON2 } from '../data/teamData';

export default function Header({ 
    activeSeason, 
    setActiveSeason, 
    currentUser, 
    onOpenAuth,
    onOpenTicketModal, 
    onLogout,
    onNavigate,
    onOpenPlayerBio
}) {
    const teamRecord = useMemo(() => {
        const standings = activeSeason === 'season1' ? DATA_STANDINGS_SEASON1 : DATA_STANDINGS_SEASON2;
        const teamData = standings.find(s => s.team === 'Nanjing Monkey Kings');
        if (teamData) {
            // Helper to get ordinal suffix
            const getOrdinal = (n) => {
                const s = ["th", "st", "nd", "rd"];
                const v = n % 100;
                return n + (s[(v - 20) % 10] || s[v] || s[0]);
            };
            return {
                record: `${teamData.w}-${teamData.l}`,
                place: `${getOrdinal(teamData.rk)} Place`
            };
        }
        return { record: '0-0', place: '-' };
    }, [activeSeason]);

    return (
        <header className="espn-team-header">
            <div className="team-identity">
                <img src="/assets/full-logo.webp" alt="Nanjing Monkey Kings Logo" className="header-logo" />
                <div className="identity-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                        <div>
                            <div className="league-meta">
                                VOLO BASKETBALL • <span id="current-season-badge">
                                    {activeSeason === 'season1' ? 'SEASON 1 (MAY 18 - JUN 29 • 6 WEEKS)' : 'SEASON 2 (JUL 20 - SEP 7 • 7 WEEKS)'}
                                </span>
                            </div>
                            <h1>NANJING MONKEY KINGS</h1>
                        </div>

                        {currentUser && (
                            <div 
                                className="user-profile-badge" 
                                style={{ 
                                    cursor: currentUser.claimedPlayerId ? 'pointer' : 'default',
                                    transition: 'transform 0.2s',
                                    padding: '0.6rem 1.25rem',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid var(--gold-primary)',
                                    marginTop: '-5px'
                                }}
                                onClick={() => currentUser.claimedPlayerId && onOpenPlayerBio(currentUser.claimedPlayerId)}
                                title={currentUser.claimedPlayerId ? "View Player Profile" : ""}
                                onMouseOver={(e) => currentUser.claimedPlayerId && (e.currentTarget.style.transform = 'scale(1.03)')}
                                onMouseOut={(e) => currentUser.claimedPlayerId && (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                {currentUser.avatar ? (
                                    <img src={currentUser.avatar} alt="User Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                ) : (
                                    <User size={24} className="gold-text" />
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="user-name" style={{ fontSize: '1.05rem' }}>{currentUser.name || 'Fan User'}</span>
                                    {currentUser.claimedPlayerId ? (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                                            Go to Player Profile <ArrowRight size={12} />
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: '0.75rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <ShieldCheck size={12} /> {currentUser.provider || 'Registered Fan'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="team-stats-row">
                        <span className="stat-pill">
                            <strong>{teamRecord.record}</strong> Record
                        </span>
                        <span 
                            className="stat-pill highlight" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => onNavigate && onNavigate('standings')}
                            title="View full standings"
                        >
                            <strong>{teamRecord.place}</strong> Volo Men's League
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
                        
                        {/* USER PROFILE IN LINE WITH BUBBLES */}
                        {currentUser ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                                <span className="tokens-tag" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    <Trophy size={16} /> {(currentUser.tokens || 1250).toLocaleString()} PTS
                                </span>
                                {/* EXIT BUBBLE */}
                                <button 
                                    className="stat-pill" 
                                    title="Sign Out" 
                                    onClick={onLogout}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        borderColor: 'rgba(239, 68, 68, 0.3)',
                                        color: '#EF4444',
                                        padding: '4px 10px',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    <LogOut size={12} /> LOG OUT
                                </button>
                            </div>
                        ) : (
                            <button className="btn-hero-secondary" style={{ padding: '0.3rem 1rem', fontSize: '0.8rem', borderRadius: '50px', marginLeft: 'auto' }} onClick={onOpenAuth}>
                                <LogIn size={13} style={{ marginRight: '4px' }} /> SIGN IN
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
