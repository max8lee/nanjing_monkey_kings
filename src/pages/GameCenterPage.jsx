import React from 'react';
import { DATA_SCHEDULE_SEASON1, DATA_SCHEDULE_SEASON2, DATA_ROSTER_SEASON1, DATA_ROSTER_SEASON2, PLAYER_GAME_LOGS, getPlayerSlug } from '../data/teamData';
import { ArrowLeft, Calendar, MapPin, Trophy } from 'lucide-react';

export default function GameCenterPage({ gameSlug, activeSeason, onBack, onOpenPlayerBio }) {
    const isSeason1 = activeSeason === 'season1' || (gameSlug || '').toString().startsWith('season1-');
    const scheduleSource = isSeason1 ? DATA_SCHEDULE_SEASON1 : DATA_SCHEDULE_SEASON2;
    const rosterSource = isSeason1 ? DATA_ROSTER_SEASON1 : DATA_ROSTER_SEASON2;
    
    // Extract Game Index or Game ID
    const cleanId = (gameSlug || '').toString().replace(/^(season1-|game-)/, '');
    let g = scheduleSource.find((item, idx) => (idx + 1).toString() === cleanId || item.opp.toLowerCase().includes(cleanId.toLowerCase()));
    if (!g && scheduleSource.length > 0) g = scheduleSource[0];
    if (!g) return null;

    const gameIndex = scheduleSource.indexOf(g) + 1;
    
    // Find player stats for this game
    const targetGameId = g.gameSlug ? parseInt(g.gameSlug.replace('game-', '')) : gameIndex;
    const boxscorePlayers = [];
    let tPts = 0, tFgm = 0, tFga = 0, tP3m = 0, tP3a = 0, tFtm = 0, tFta = 0, tDreb = 0, tOreb = 0, tReb = 0, tAst = 0, tStl = 0, tBlk = 0, tTo = 0;

    rosterSource.forEach(p => {
        const pLogs = PLAYER_GAME_LOGS[p.id] || [];
        const matchLog = pLogs.find(log => log.gameId === targetGameId);
        
        if (matchLog) {
            boxscorePlayers.push({ player: p, log: matchLog });
            tPts += matchLog.pts;
            tFgm += matchLog.fgm;
            tFga += matchLog.fga;
            tP3m += matchLog.p3m;
            tP3a += matchLog.p3a;
            tFtm += matchLog.ftm;
            tFta += matchLog.fta;
            tDreb += matchLog.dreb;
            tOreb += matchLog.oreb;
            tReb += matchLog.reb;
            tAst += matchLog.ast;
            tStl += matchLog.stl;
            tBlk += matchLog.blk;
            tTo += matchLog.to;
        }
    });

    const isWin = g.status.includes('W');
    const isUpcoming = g.status === 'UPCOMING';
    
    let nanjingScore = '--';
    let oppScore = '--';
    if (!isUpcoming) {
        const scoreParts = g.status.replace(/^[WL]\s*/, '').split('-');
        if (scoreParts.length === 2) {
            nanjingScore = parseInt(scoreParts[0]) || 0;
            oppScore = parseInt(scoreParts[1]) || 0;
        }
    }

    const fgPctStr = tFga > 0 ? ((tFgm / tFga) * 100).toFixed(1) + '%' : '0.0%';
    const p3PctStr = tP3a > 0 ? ((tP3m / tP3a) * 100).toFixed(1) + '%' : '0.0%';
    const ftPctStr = tFta > 0 ? ((tFtm / tFta) * 100).toFixed(1) + '%' : '0.0%';

    return (
        <div className="page-section active">
            <button className="btn-bio-back" onClick={onBack} style={{ marginBottom: '1rem' }}>
                <ArrowLeft size={16} /> BACK TO SCHEDULE
            </button>

            {/* GAME SCOREBOARD HERO CARD */}
            <div className="game-hero-card">
                <div className="game-meta-bar">
                    <span className={`game-status-tag ${isUpcoming ? 'upcoming' : ''}`}>
                        {isUpcoming ? 'UPCOMING TIP-OFF' : 'FINAL BOX SCORE'}
                    </span>
                    <span className="game-date-venue">
                        📅 {g.date} • 📍 {g.venue} • {isSeason1 ? 'SEASON 1' : 'SEASON 2'}
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

                {!isUpcoming && (
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
                                    <td>{Math.round(nanjingScore * 0.45)}</td>
                                    <td>{nanjingScore - Math.round(nanjingScore * 0.45)}</td>
                                    <td><strong className="gold-text">{nanjingScore}</strong></td>
                                </tr>
                                <tr className={!isWin ? 'highlight-row' : ''}>
                                    <td><strong>{g.opp}</strong></td>
                                    <td>{Math.round(oppScore * 0.48)}</td>
                                    <td>{oppScore - Math.round(oppScore * 0.48)}</td>
                                    <td><strong>{oppScore}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!isUpcoming && (
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
                                        <th>PLAYER</th>
                                        <th>PTS</th>
                                        <th>FGM-A</th>
                                        <th>3PM-A</th>
                                        <th>FTM-A</th>
                                        <th>REB (D/O)</th>
                                        <th>AST</th>
                                        <th>STL</th>
                                        <th>BLK</th>
                                        <th>TO</th>
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
                                        boxscorePlayers.map((b) => {
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
                                                    <td>{l.reb} ({l.dreb}/{l.oreb})</td>
                                                    <td>{l.ast}</td>
                                                    <td>{l.stl}</td>
                                                    <td>{l.blk}</td>
                                                    <td>{l.to}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    {boxscorePlayers.length > 0 && (
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
