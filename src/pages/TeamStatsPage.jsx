import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity, Target, Shield, Zap } from 'lucide-react';
import { DATA_SCHEDULE_SEASON1 } from '../data/teamData';
import { formatSeasonString } from '../utils/stringUtils';

export default function TeamStatsPage({ activeSeason }) {
    const [teamStatsAvg, setTeamStatsAvg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamStats = async () => {
            setLoading(true);
            setTeamStatsAvg(null);
            
            if (activeSeason === 'season1') {
                let gamesPlayed = 0;
                let totals = { pts: 0, oppPts: 0, margin: 0 };
                
                DATA_SCHEDULE_SEASON1.forEach(game => {
                    if (game.status) {
                        const match = game.status.match(/([WL])\s+(\d+)-(\d+)/);
                        if (match) {
                            gamesPlayed++;
                            const pts = parseInt(match[2], 10);
                            const oppPts = parseInt(match[3], 10);
                            totals.pts += pts;
                            totals.oppPts += oppPts;
                            totals.margin += (pts - oppPts);
                        }
                    }
                });

                if (gamesPlayed > 0) {
                    setTeamStatsAvg({
                        pts: totals.pts / gamesPlayed,
                        oppPts: totals.oppPts / gamesPlayed,
                        margin: totals.margin / gamesPlayed,
                        gamesPlayed
                    });
                } else {
                    setTeamStatsAvg(null);
                }
                setLoading(false);
                return;
            }
            
            try {
                const q = query(collection(db, 'seasons', activeSeason, 'games'), orderBy('gameId', 'asc'));
                const snap = await getDocs(q);
                
                let gamesPlayed = 0;
                let totals = {
                    pts: 0, oppPts: 0, margin: 0,
                    h1Pts: 0, oppH1Pts: 0,
                    fgm: 0, fga: 0,
                    p3m: 0, p3a: 0,
                    ftm: 0, fta: 0,
                    oreb: 0, dreb: 0, reb: 0,
                    ast: 0, stl: 0, blk: 0, to: 0
                };

                snap.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.result !== 'UPCOMING' && data.result && data.teamStats) {
                        gamesPlayed++;
                        totals.pts += Number(data.finalTotal || 0);
                        totals.oppPts += Number(data.oppFinalTotal || 0);
                        totals.margin += Number(data.margin || 0);
                        totals.h1Pts += Number(data.q1End || 0);
                        totals.oppH1Pts += Number(data.oppQ1End || 0);
                        
                        const ts = data.teamStats;
                        totals.fgm += Number(ts.fgm || 0);
                        totals.fga += Number(ts.fga || 0);
                        totals.p3m += Number(ts.p3m || 0);
                        totals.p3a += Number(ts.p3a || 0);
                        totals.ftm += Number(ts.ftm || 0);
                        totals.fta += Number(ts.fta || 0);
                        totals.oreb += Number(ts.oreb || 0);
                        totals.dreb += Number(ts.dreb || 0);
                        totals.reb += (Number(ts.oreb || 0) + Number(ts.dreb || 0));
                        totals.ast += Number(ts.ast || 0);
                        totals.stl += Number(ts.stl || 0);
                        totals.blk += Number(ts.blk || 0);
                        totals.to += Number(ts.to || 0);
                    }
                });

                if (gamesPlayed > 0) {
                    const avg = {};
                    for (let key in totals) {
                        avg[key] = (totals[key] / gamesPlayed);
                    }
                    setTeamStatsAvg({ ...avg, gamesPlayed });
                } else {
                    setTeamStatsAvg(null);
                }
            } catch (err) {
                console.error("Error fetching team stats:", err);
            }
            setLoading(false);
        };
        fetchTeamStats();
    }, [activeSeason]);

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading team stats...</div>;
    }

    if (!teamStatsAvg) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--navy-panel)', borderRadius: '12px' }}>
                <p>No completed games data found for {formatSeasonString(activeSeason)}.</p>
            </div>
        );
    }

    const formatNumber = (num, decimals = 1) => {
        if (typeof num !== 'number') return '0.0';
        return num.toFixed(decimals);
    };

    return (
        <div className="page-container fade-in">
            <div className="page-header">
                <h2>{formatSeasonString(activeSeason)} TEAM STATISTICS</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {/* Scoring Overview */}
                <div style={{ background: 'var(--navy-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <Activity size={24} style={{ color: '#FCD34D', marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Points Per Game</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatNumber(teamStatsAvg.pts)}</div>
                </div>

                <div style={{ background: 'var(--navy-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <Shield size={24} style={{ color: '#EF4444', marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Points Allowed</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatNumber(teamStatsAvg.oppPts)}</div>
                </div>

                <div style={{ background: 'var(--navy-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <Target size={24} style={{ color: '#34D399', marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Margin</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: teamStatsAvg.margin > 0 ? '#34D399' : '#EF4444' }}>
                        {teamStatsAvg.margin > 0 ? '+' : ''}{formatNumber(teamStatsAvg.margin)}
                    </div>
                </div>

                {activeSeason !== 'season1' && (
                    <>
                        <div style={{ background: 'var(--navy-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                            <Zap size={24} style={{ color: '#60A5FA', marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '0.85rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>1st Half PPG</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatNumber(teamStatsAvg.h1Pts)}</div>
                        </div>

                        <div style={{ background: 'var(--navy-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                            <Shield size={24} style={{ color: '#F87171', marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '0.85rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>1H Points Allowed</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatNumber(teamStatsAvg.oppH1Pts)}</div>
                        </div>
                    </>
                )}
            </div>

            {activeSeason !== 'season1' && (
                <div style={{ background: 'var(--navy-panel)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Detailed Metrics</h3>
                    </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="stats-table" style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '1rem' }}>Category</th>
                                <th>FGM</th>
                                <th>FGA</th>
                                <th>FG%</th>
                                <th>3PM</th>
                                <th>3PA</th>
                                <th>3P%</th>
                                <th>FTM</th>
                                <th>FTA</th>
                                <th>FT%</th>
                                <th>OREB</th>
                                <th>DREB</th>
                                <th>REB</th>
                                <th>AST</th>
                                <th>STL</th>
                                <th>BLK</th>
                                <th>TO</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>Averages</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.fgm)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.fga)}</td>
                                <td style={{ textAlign: 'center' }}>{teamStatsAvg.fga > 0 ? formatNumber((teamStatsAvg.fgm / teamStatsAvg.fga) * 100) : '0.0'}%</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.p3m)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.p3a)}</td>
                                <td style={{ textAlign: 'center' }}>{teamStatsAvg.p3a > 0 ? formatNumber((teamStatsAvg.p3m / teamStatsAvg.p3a) * 100) : '0.0'}%</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.ftm)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.fta)}</td>
                                <td style={{ textAlign: 'center' }}>{teamStatsAvg.fta > 0 ? formatNumber((teamStatsAvg.ftm / teamStatsAvg.fta) * 100) : '0.0'}%</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.oreb)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.dreb)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.reb)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.ast)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.stl)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.blk)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(teamStatsAvg.to)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            )}
        </div>
    );
}
