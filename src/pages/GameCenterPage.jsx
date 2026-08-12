import React, { useState } from 'react';
import { DATA_SCHEDULE_SEASON1, DATA_SCHEDULE_SEASON2, DATA_ROSTER_SEASON1, DATA_ROSTER_SEASON2, getPlayerSlug, formatDateTime } from '../data/teamData';
import { ArrowLeft, Calendar, MapPin, Trophy } from 'lucide-react';

export default function GameCenterPage({ gameSlug, activeSeason, seasonGames, seasonLogs, customPlayerBios = {}, onBack, onOpenPlayerBio }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState('desc');

    const isSeason1 = activeSeason === 'season1' || (gameSlug || '').toString().startsWith('season1-');
    const scheduleSource = seasonGames?.length > 0 ? seasonGames : (isSeason1 ? DATA_SCHEDULE_SEASON1 : DATA_SCHEDULE_SEASON2);
    const rosterSource = isSeason1 ? DATA_ROSTER_SEASON1 : DATA_ROSTER_SEASON2;
    
    // Extract Game Index or Game ID
    const cleanId = (gameSlug || '').toString().replace(/^(season1-|game-)/, '');
    let g = scheduleSource.find(item => item.gameSlug === gameSlug);
    if (!g) {
        g = scheduleSource.find((item, idx) => (idx + 1).toString() === cleanId || item.opp.toLowerCase().includes(cleanId.toLowerCase()));
    }
    if (!g && scheduleSource.length > 0) g = scheduleSource[0];
    if (!g) return null;

    const gameIndex = scheduleSource.indexOf(g) + 1;
    
    // Find player stats for this game
    const targetGameId = g.gameSlug ? parseInt(g.gameSlug.replace('game-', '')) : gameIndex;
    const boxscorePlayers = [];
    let tPts = 0, tFgm = 0, tFga = 0, tP3m = 0, tP3a = 0, tFtm = 0, tFta = 0, tDreb = 0, tOreb = 0, tReb = 0, tAst = 0, tStl = 0, tBlk = 0, tTo = 0;

    rosterSource.forEach(p => {
        let pLogs = [];
        if (seasonLogs?.length > 0) {
            pLogs = seasonLogs.filter(log => log.playerId === p.id);
        } else {
            pLogs = []; // Fallback empty array since PLAYER_GAME_LOGS is being removed
        }
        
        const matchLog = pLogs.find(log => log.gameId === targetGameId);
        
        if (matchLog) {
            const overriddenPlayer = { ...p };
            if (customPlayerBios[p.id]) {
                if (customPlayerBios[p.id].pos) overriddenPlayer.pos = customPlayerBios[p.id].pos;
                if (customPlayerBios[p.id].jersey) overriddenPlayer.jersey = customPlayerBios[p.id].jersey;
            }
            boxscorePlayers.push({ player: overriddenPlayer, log: matchLog });
        }
    });

    if (g.teamStats) {
        tFgm = g.teamStats.fgm || 0;
        tFga = g.teamStats.fga || 0;
        tP3m = g.teamStats.p3m || 0;
        tP3a = g.teamStats.p3a || 0;
        tFtm = g.teamStats.ftm || 0;
        tFta = g.teamStats.fta || 0;
        tDreb = g.teamStats.dreb || 0;
        tOreb = g.teamStats.oreb || 0;
        tReb = (tDreb + tOreb) > 0 ? (tDreb + tOreb) : (g.teamStats.reb || 0);
        tAst = g.teamStats.ast || 0;
        tStl = g.teamStats.stl || 0;
        tBlk = g.teamStats.blk || 0;
        tTo = g.teamStats.to || 0;
        tPts = (tFgm - tP3m) * 2 + tP3m * 3 + tFtm;
    } else {
        boxscorePlayers.forEach(entry => {
            const matchLog = entry.log;
            tPts += matchLog.pts || 0;
            tFgm += matchLog.fgm || 0;
            tFga += matchLog.fga || 0;
            tP3m += matchLog.p3m || 0;
            tP3a += matchLog.p3a || 0;
            tFtm += matchLog.ftm || 0;
            tFta += matchLog.fta || 0;
            const logDreb = matchLog.dreb || 0;
            const logOreb = matchLog.oreb || 0;
            tDreb += logDreb;
            tOreb += logOreb;
            tReb += (logDreb + logOreb) > 0 ? (logDreb + logOreb) : (matchLog.reb || 0);
            tAst += matchLog.ast || 0;
            tStl += matchLog.stl || 0;
            tBlk += matchLog.blk || 0;
            tTo += matchLog.to || 0;
        });
    }

    const isWin = g.result === 'W' || g.status?.includes('W');
    const isLoss = g.result === 'L' || g.status?.includes('L');
    const isUpcoming = !isWin && !isLoss;
    
    let nanjingScore = '--';
    let oppScore = '--';
    if (g.result) {
        nanjingScore = g.finalTotal || 0;
        oppScore = g.oppFinalTotal || 0;
    } else if (!isUpcoming) {
        const scoreParts = (g.status || '').replace(/^[WL]\s*/, '').split('-');
        if (scoreParts.length === 2) {
            nanjingScore = parseInt(scoreParts[0]) || 0;
            oppScore = parseInt(scoreParts[1]) || 0;
        }
    }

    const fgPctStr = tFga > 0 ? ((tFgm / tFga) * 100).toFixed(1) + '%' : '0.0%';
    const p3PctStr = tP3a > 0 ? ((tP3m / tP3a) * 100).toFixed(1) + '%' : '0.0%';
    const ftPctStr = tFta > 0 ? ((tFtm / tFta) * 100).toFixed(1) + '%' : '0.0%';

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    const sortedBoxscorePlayers = [...boxscorePlayers].sort((a, b) => {
        if (!sortKey) return 0;
        let valA, valB;
        if (sortKey === 'player') {
            valA = a.player.name;
            valB = b.player.name;
        } else if (sortKey === 'reb') {
            valA = ((a.log.dreb || 0) + (a.log.oreb || 0)) > 0 ? ((a.log.dreb || 0) + (a.log.oreb || 0)) : (a.log.reb || 0);
            valB = ((b.log.dreb || 0) + (b.log.oreb || 0)) > 0 ? ((b.log.dreb || 0) + (b.log.oreb || 0)) : (b.log.reb || 0);
        } else if (sortKey === 'fgm') {
            valA = a.log.fgm || 0;
            valB = b.log.fgm || 0;
        } else if (sortKey === 'p3m') {
            valA = a.log.p3m || 0;
            valB = b.log.p3m || 0;
        } else if (sortKey === 'ftm') {
            valA = a.log.ftm || 0;
            valB = b.log.ftm || 0;
        } else {
            valA = a.log[sortKey] || 0;
            valB = b.log[sortKey] || 0;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="page-section active">
            <button className="btn-bio-back" onClick={onBack} style={{ marginBottom: '1rem' }}>
                <ArrowLeft size={16} /> BACK TO PREVIOUS PAGE
            </button>

            {/* GAME SCOREBOARD HERO CARD */}
            <div className="game-hero-card">
                <div className="game-meta-bar">
                    <span className={`game-status-tag ${isUpcoming ? 'upcoming' : ''}`}>
                        {isUpcoming ? 'UPCOMING' : 'FINAL BOX SCORE'}
                    </span>
                    <span className="game-date-venue">
                        📅 {formatDateTime(g.date)} • 📍 {g.venue || 'Telegraph Hill Community Center'} • {isSeason1 ? 'SEASON 1' : 'SEASON 2'}
                    </span>
                </div>

                <div className="game-matchup-grid">
                    {/* NANJING MONKEY KINGS */}
                    <div className="team-side home">
                        <img src="/assets/full-logo.webp" alt="Nanjing Monkey Kings" className="game-team-logo" />
                        <div className="team-name-box">
                            <h2>Nanjing Monkey Kings</h2>
                            <span className="team-record">{isSeason1 ? 'Season 1 (1-5)' : 'Season 2 (1-2)'}</span>
                        </div>
                        <span className={`team-score ${isWin ? 'winner' : ''}`}>{nanjingScore}</span>
                    </div>

                    <div className="vs-divider">VS</div>

                    {/* OPPONENT */}
                    <div className="team-side away">
                        <span className={`team-score ${!isWin && !isUpcoming ? 'winner' : ''}`}>{oppScore}</span>
                        <div className="team-name-box" style={{ textAlign: 'right' }}>
                            <h2>{g.opp}</h2>
                            <span className="team-record">Opponent</span>
                        </div>
                        <div className="game-opp-logo-placeholder">🏀</div>
                    </div>
                </div>

                {!isSeason1 && (
                    <div className="linescore-wrapper">
                        <table className="espn-table linescore-table">
                            <thead>
                                <tr>
                                    <th>TEAM</th>
                                    <th>1ST HALF</th>
                                    <th>2ND HALF</th>
                                    <th>TOTAL PTS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={isWin ? 'highlight-row' : ''}>
                                    <td><strong>🏀 Nanjing Monkey Kings</strong></td>
                                    <td>{(g.q1End !== undefined && g.q1End !== '') ? g.q1End : (nanjingScore === '--' ? 0 : Math.round(nanjingScore * 0.45))}</td>
                                    <td>{nanjingScore === '--' ? 0 : (nanjingScore - ((g.q1End !== undefined && g.q1End !== '') ? g.q1End : Math.round(nanjingScore * 0.45)))}</td>
                                    <td><strong className="gold-text">{nanjingScore === '--' ? 0 : nanjingScore}</strong></td>
                                </tr>
                                <tr className={isLoss ? 'highlight-row' : ''}>
                                    <td><strong>{g.opp}</strong></td>
                                    <td>{(g.oppQ1End !== undefined && g.oppQ1End !== '') ? g.oppQ1End : (oppScore === '--' ? 0 : Math.round(oppScore * 0.48))}</td>
                                    <td>{oppScore === '--' ? 0 : (oppScore - ((g.oppQ1End !== undefined && g.oppQ1End !== '') ? g.oppQ1End : Math.round(oppScore * 0.48)))}</td>
                                    <td><strong>{oppScore === '--' ? 0 : oppScore}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!isUpcoming && !isSeason1 && (
                <>
                    {/* TEAM COMPARISON & SHOOTING EFFICIENCY */}
                    <div className="bio-card-box">
                        <h3>📊 NANJING TEAM SHOOTING & STATISTICAL BREAKDOWN</h3>
                        <div className="bio-stats-summary-grid">
                            <div className="bio-stat-box"><span className="label">TOTAL PTS</span><strong className="gold-text">{tPts}</strong></div>
                            <div className="bio-stat-box"><span className="label">FG EFFICIENCY</span><strong>{fgPctStr} ({tFgm}/{tFga})</strong></div>
                            <div className="bio-stat-box"><span className="label">3PT SHOOTING</span><strong>{p3PctStr} ({tP3m}/{tP3a})</strong></div>
                            <div className="bio-stat-box"><span className="label">FT SHOOTING</span><strong>{ftPctStr} ({tFtm}/{tFta})</strong></div>
                            <div className="bio-stat-box"><span className="label">REBOUNDS</span><strong>{tReb} ({tDreb}/{tOreb})</strong></div>
                            <div className="bio-stat-box"><span className="label">ASSISTS / TO</span><strong>{tAst} / {tTo}</strong></div>
                        </div>
                    </div>

                    {/* PLAYER BOX SCORE TABLE */}
                    <div className="bio-card-box">
                        <h3>📋 OFFICIAL PLAYER BOX SCORE SHEET</h3>
                        <div className="schedule-table-wrapper">
                            <table className="espn-table">
                                <thead>
                                    <tr>
                                        <th className="sortable-header" onClick={() => handleSort('player')}>PLAYER {sortKey === 'player' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                        <th className="sortable-header" onClick={() => handleSort('pts')}>PTS {sortKey === 'pts' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                        <th className="sortable-header" onClick={() => handleSort('fgm')}>FGM-A {sortKey === 'fgm' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                        <th className="sortable-header" onClick={() => handleSort('p3m')}>3PM-A {sortKey === 'p3m' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                        <th className="sortable-header" onClick={() => handleSort('ftm')}>FTM-A {sortKey === 'ftm' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                        <th className="sortable-header" onClick={() => handleSort('reb')}>REB (D/O) {sortKey === 'reb' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                        <th className="sortable-header" onClick={() => handleSort('ast')}>AST {sortKey === 'ast' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                        <th className="sortable-header" onClick={() => handleSort('stl')}>STL {sortKey === 'stl' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                        <th className="sortable-header" onClick={() => handleSort('blk')}>BLK {sortKey === 'blk' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                        <th className="sortable-header" onClick={() => handleSort('to')}>TO {sortKey === 'to' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boxscorePlayers.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                                                Individual player box score details were unrecorded for this matchup.
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedBoxscorePlayers.map((b) => {
                                            const p = b.player;
                                            const l = b.log;
                                            const slug = getPlayerSlug(p.name);
                                            return (
                                                <tr key={p.id + l.gameId}>
                                                    <td>
                                                        <strong className="player-boxscore-name" onClick={() => onOpenPlayerBio(slug)}>
                                                            {p.name}
                                                        </strong> <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({p.pos})</span>
                                                    </td>
                                                    <td><strong className="gold-text">{l.pts}</strong></td>
                                                    <td>{l.fgm}-{l.fga}</td>
                                                    <td>{l.p3m}-{l.p3a}</td>
                                                    <td>{l.ftm}-{l.fta}</td>
                                                    <td>{((l.dreb || 0) + (l.oreb || 0)) > 0 ? ((l.dreb || 0) + (l.oreb || 0)) : (l.reb || 0)} ({l.dreb || 0}/{l.oreb || 0})</td>
                                                    <td>{l.ast}</td>
                                                    <td>{l.stl}</td>
                                                    <td>{l.blk}</td>
                                                    <td>{l.to}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    {((boxscorePlayers.length > 0) || g.teamStats) && (
                                        <tr style={{ background: 'var(--navy-dark)', fontWeight: 800, borderTop: '2px solid var(--gold-accent)' }}>
                                            <td><strong>TEAM TOTALS</strong></td>
                                            <td><strong className="gold-text">{tPts}</strong></td>
                                            <td>{tFgm}-{tFga}</td>
                                            <td>{tP3m}-{tP3a}</td>
                                            <td>{tFtm}-{tFta}</td>
                                            <td>{tReb} ({tDreb}/{tOreb})</td>
                                            <td>{tAst}</td>
                                            <td>{tStl}</td>
                                            <td>{tBlk}</td>
                                            <td>{tTo}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
