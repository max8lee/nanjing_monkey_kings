import React from 'react';
import { DATA_ROSTER_SEASON1, DATA_ROSTER_SEASON2, getPlayerSlug, calculatePlayerSeasonStats, formatDateTime } from '../data/teamData';
import { ArrowLeft, Edit3, ShieldCheck, Crown } from 'lucide-react';

export default function PlayerBioPage({ 
    playerSlug, 
    activeSeason, 
    currentUser, 
    customPlayerBios = {}, 
    claimedPlayers = {},
    seasonGames = [],
    seasonLogs = [],
    onBack, 
    onOpenEditModal,
    onOpenGamePage
}) {
    const rosterSource = activeSeason === 'season1' ? DATA_ROSTER_SEASON1 : DATA_ROSTER_SEASON2;
    const cleanQuery = (playerSlug || '').toString().toLowerCase();

    let basePlayer = rosterSource.find(item => getPlayerSlug(item.name) === cleanQuery || item.id === cleanQuery) 
         || DATA_ROSTER_SEASON2.find(item => getPlayerSlug(item.name) === cleanQuery || item.id === cleanQuery)
         || rosterSource.find(item => item.name.toLowerCase().includes(cleanQuery.replace('-', ' ')))
         || rosterSource[0];

    // Compute dynamic statistical averages directly from game logs!
    const dynamicStats = calculatePlayerSeasonStats(basePlayer.id, activeSeason, seasonLogs);
    
    let p = {
        ...basePlayer,
        ppg: dynamicStats.gp > 0 ? dynamicStats.ppg : basePlayer.ppg,
        rpg: dynamicStats.gp > 0 ? dynamicStats.rpg : basePlayer.rpg,
        apg: dynamicStats.gp > 0 ? dynamicStats.apg : basePlayer.apg,
        fgPct: dynamicStats.gp > 0 ? dynamicStats.fgPct : (basePlayer.fgPct || '0.0%'),
        p3Pct: dynamicStats.gp > 0 ? dynamicStats.p3Pct : (basePlayer.p3Pct || '0.0%'),
        ftPct: dynamicStats.gp > 0 ? dynamicStats.ftPct : (basePlayer.ftPct || '0.0%')
    };

    // Merge custom overrides if edited by the teammate (excluding official stats)!
    if (customPlayerBios[p.id]) {
        const { ppg, rpg, apg, fgPct, p3Pct, ftPct, ...customVitals } = customPlayerBios[p.id];
        p = { ...p, ...customVitals };
    }

    const slug = getPlayerSlug(p.name);
    let logs = [];
    
    if (seasonLogs && seasonLogs.length > 0) {
        logs = seasonLogs.filter(log => log.playerId === p.id);
        // sort by gameId descending
        logs.sort((a, b) => b.gameId - a.gameId);
    }

    // Check ownership
    const isOwner = currentUser && (
        currentUser.claimedPlayerId === p.id ||
        (currentUser.name && currentUser.name.toLowerCase() === p.name.toLowerCase())
    );

    const isClaimedByOther = claimedPlayers[p.id] && !isOwner;
    const claimOwnerName = isClaimedByOther ? claimedPlayers[p.id].claimedBy : '';

    return (
        <div className="page-section active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button className="btn-bio-back" onClick={onBack}>
                    <ArrowLeft size={16} /> BACK TO PREVIOUS PAGE
                </button>

                {isOwner && (
                    <button className="btn-espn-gold" onClick={() => onOpenEditModal(p)}>
                        <Edit3 size={16} /> EDIT MY PLAYER PROFILE
                    </button>
                )}
            </div>

            {/* PLAYER PROFILE HERO HEADER */}
            <div className="bio-hero-card">
                <div className="bio-hero-avatar">
                    <img src={p.img} alt={p.name} />
                </div>

                <div className="bio-hero-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <h1>{p.name}</h1>
                        {p.nickname && <span className="nickname-pill">"{p.nickname}"</span>}
                        {isOwner && (
                            <span className="claimed-badge owner">
                                <Crown size={12} /> YOUR CLAIMED PLAYER
                            </span>
                        )}
                        {isClaimedByOther && (
                            <span className="claimed-badge other">
                                <ShieldCheck size={12} /> CLAIMED BY {claimOwnerName.toUpperCase()}
                            </span>
                        )}
                    </div>

                    <p className="bio-meta-subtitle">
                        {p.pos} &nbsp;|&nbsp; Nanjing Monkey Kings &nbsp;|&nbsp; #{p.jersey.replace('#', '')}
                    </p>

                    <div className="bio-vitals-row">
                        <div className="vital-chip"><span>HEIGHT:</span> <strong>{p.height}</strong></div>
                        <div className="vital-chip"><span>WEIGHT:</span> <strong>{p.weight}</strong></div>
                        <div className="vital-chip"><span>COLLEGE:</span> <strong>{p.college}</strong></div>
                        <div className="vital-chip highlight"><span>STATUS:</span> <strong>{p.status}</strong></div>
                    </div>
                </div>
            </div>

            {/* BIOGRAPHY PARAGRAPH */}
            <div className="bio-card-box">
                <h3>📖 PLAYER BIOGRAPHY</h3>
                <p>{p.bio}</p>
            </div>

            {/* DYNAMIC OFFICIAL SEASON STATS SUMMARY GRID */}
            <div className="bio-card-box">
                <h3>📊 {activeSeason.toUpperCase()} DYNAMIC STATISTICAL AVERAGES</h3>
                <div className="bio-stats-summary-grid">
                    <div className="bio-stat-box"><span className="label">PPG</span><strong className="gold-text">{p.ppg}</strong></div>
                    <div className="bio-stat-box"><span className="label">RPG</span><strong>{p.rpg}</strong></div>
                    <div className="bio-stat-box"><span className="label">APG</span><strong>{p.apg}</strong></div>
                    <div className="bio-stat-box"><span className="label">FG%</span><strong>{p.fgPct || '0.0%'}</strong></div>
                    <div className="bio-stat-box"><span className="label">3P%</span><strong>{p.p3Pct || '0.0%'}</strong></div>
                    <div className="bio-stat-box"><span className="label">FT%</span><strong>{p.ftPct || '0.0%'}</strong></div>
                </div>
            </div>

            {/* PER-GAME LOG TABLE */}
            <div className="bio-card-box">
                <h3>📅 GAME LOG</h3>
                <div className="schedule-table-wrapper">
                    <table className="espn-table">
                        <thead>
                            <tr>
                                <th>GAME</th>
                                <th>DATE</th>
                                <th>OPPONENT</th>
                                <th>RESULT</th>
                                <th>PTS</th>
                                <th>FGM-A</th>
                                <th>3PM-A</th>
                                <th>FTM-A</th>
                                <th>REB (D/O)</th>
                                <th>AST</th>
                                <th>STL</th>
                                <th>BLK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                logs.map((g, idx) => {
                                    const dReb = g.dreb !== undefined ? g.dreb : 0;
                                    const oReb = g.oreb !== undefined ? g.oreb : 0;
                                    const totReb = (dReb + oReb) > 0 ? (dReb + oReb) : (g.reb || 0);
                                    
                                    const relatedGame = seasonGames.find(sg => sg.gameId === g.gameId);
                                    let gameResultText = '-';
                                    let isWin = false;
                                    let isLoss = false;
                                    if (relatedGame && relatedGame.result) {
                                        gameResultText = `${relatedGame.result} ${Math.max(relatedGame.finalTotal || 0, relatedGame.oppFinalTotal || 0)}-${Math.min(relatedGame.finalTotal || 0, relatedGame.oppFinalTotal || 0)}`;
                                        isWin = relatedGame.result === 'W';
                                        isLoss = relatedGame.result === 'L';
                                    } else if (g.result) { // Fallback for hardcoded
                                        gameResultText = g.result;
                                        isWin = g.result.includes('W');
                                        isLoss = g.result.includes('L');
                                    }

                                    return (
                                        <tr 
                                            key={idx}
                                            style={{ cursor: onOpenGamePage ? 'pointer' : 'default' }}
                                            onClick={() => {
                                                if (onOpenGamePage) {
                                                    const gid = g.gameId || (idx + 1);
                                                    onOpenGamePage(g.gameSlug || `game-${gid}`);
                                                }
                                            }}
                                        >
                                            <td><strong>Game {g.gameId || (idx + 1)}</strong></td>
                                            <td>{formatDateTime(g.date)}</td>
                                            <td>{g.opp}</td>
                                            <td>
                                                <span className={`result-tag ${isWin ? 'win' : (isLoss ? 'loss' : '')}`}>
                                                    {gameResultText}
                                                </span>
                                            </td>
                                            <td><strong className="gold-text">{g.pts}</strong></td>
                                            <td>{g.fgm}-{g.fga}</td>
                                            <td>{g.p3m}-{g.p3a}</td>
                                            <td>{g.ftm}-{g.fta}</td>
                                            <td>{totReb} ({dReb}/{oReb})</td>
                                            <td>{g.ast}</td>
                                            <td>{g.stl || 0}</td>
                                            <td>{g.blk || 0}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                                        No game log entries recorded for this season.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
