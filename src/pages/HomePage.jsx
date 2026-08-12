import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Trophy, Flame, Play, HelpCircle, ArrowRight } from 'lucide-react';
import { 
    DATA_SCHEDULE_SEASON1, 
    DATA_SCHEDULE_SEASON2,
    DATA_STATS_SEASON1,
    DATA_STATS_SEASON2,
    DATA_ROSTER_SEASON1,
    DATA_ROSTER_SEASON2,
    getPlayerSlug,
    getMergedRoster,
    formatDateTime
} from '../data/teamData';
import { getTopUsersByTokens, onPollUpdate, submitPollVote } from '../firebaseDb';

export default function HomePage({ activeSeason, seasonGames, seasonLogs, onNavigate, onOpenPlayerBio, onOpenGamePage, onOpenFilmPage, onOpenTicketModal, currentUser }) {
    const [timeLeft, setTimeLeft] = useState({ d: '03', h: '14', m: '22', s: '45' });
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        getTopUsersByTokens(4).then(setLeaderboard).catch(console.error);
    }, []);

    const nextGame = useMemo(() => {
        const schedule = seasonGames.length > 0 ? seasonGames : (activeSeason === 'season1' ? DATA_SCHEDULE_SEASON1 : DATA_SCHEDULE_SEASON2);
        const upcomingGames = schedule.filter(g => {
            const isWin = g.result === 'W' || g.status?.includes('W');
            const isLoss = g.result === 'L' || g.status?.includes('L');
            return !isWin && !isLoss;
        });
        return upcomingGames.length > 0 ? upcomingGames[upcomingGames.length - 1] : null;
    }, [activeSeason, seasonGames]);

    useEffect(() => {
        if (!nextGame) return;

        const dateStr = formatDateTime(nextGame.date);
        const parts = dateStr.split(' • ');
        const datePart = parts[0] || 'AUG 01';
        const timePart = parts[1] || '19:00';
        
        // Assume 2026 and Pacific Daylight Time (GMT-0700) for summer games
        const targetDate = new Date(`${datePart}, 2026 ${timePart}:00 GMT-0700`);

        const updateTimer = () => {
            const now = new Date();
            const totalSeconds = Math.floor((targetDate - now) / 1000);

            if (totalSeconds <= 0) {
                setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
                return;
            }

            const d = Math.floor(totalSeconds / (3600 * 24));
            const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = Math.floor(totalSeconds % 60);

            setTimeLeft({
                d: String(d).padStart(2, '0'),
                h: String(h).padStart(2, '0'),
                m: String(m).padStart(2, '0'),
                s: String(s).padStart(2, '0')
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [nextGame]);

    const [pollVotes, setPollVotes] = useState({});

    useEffect(() => {
        const unsubscribe = onPollUpdate('poll_of_the_week_1', (data) => {
            setPollVotes(data);
        });
        return () => unsubscribe();
    }, []);

    const hasVoted = currentUser && pollVotes[currentUser.uid];

    const getVoteCount = (optName) => {
        return Object.values(pollVotes).filter(v => v === optName).length;
    };
    
    const getTotalVotes = () => {
        return Object.keys(pollVotes).length;
    };

    const handlePollVote = async (optName) => {
        if (!currentUser) {
            alert('You must be signed in to vote!');
            return;
        }
        await submitPollVote('poll_of_the_week_1', currentUser.uid, optName);
    };

    const statLeaders = useMemo(() => {
        let stats;
        const roster = activeSeason === 'season1' ? DATA_ROSTER_SEASON1 : DATA_ROSTER_SEASON2;
        
        const merged = getMergedRoster(activeSeason, {}, seasonLogs);
        stats = merged.filter(p => p.gp > 0);

        if (!stats.length) return null;

        const getLeader = (metric) => {
            const maxVal = Math.max(...stats.map(s => s[metric]));
            const leaderStat = stats.find(s => s[metric] === maxVal);
            if (!leaderStat) return null;
            const playerRosterInfo = roster.find(r => r.id === leaderStat.id);
            return {
                name: leaderStat.name,
                val: maxVal.toFixed(1),
                img: playerRosterInfo?.img || '/assets/logo.webp',
                jersey: playerRosterInfo?.jersey || '#00',
                pos: playerRosterInfo?.pos || 'Unknown',
                slug: playerRosterInfo ? getPlayerSlug(playerRosterInfo.name) : ''
            };
        };

        return {
            pts: getLeader('ppg'),
            reb: getLeader('rpg'),
            ast: getLeader('apg')
        };
    }, [activeSeason]);

    return (
        <div className="page-section active">
            {/* HERO SPOTLIGHT BANNER */}
            {nextGame && (
                <div className="hero-banner-card">
                    <div className="hero-content">
                        <span className="hero-badge">
                            <Flame size={14} style={{ marginRight: '4px' }} /> NEXT MATCHUP SPOTLIGHT
                        </span>
                        <h2>MONKEY KINGS VS {nextGame.opp.toUpperCase()}</h2>
                        <p className="hero-match-meta">
                            <Calendar size={14} /> {formatDateTime(nextGame.date)} PST &nbsp;|&nbsp; <MapPin size={14} /> {nextGame.venue || 'Telegraph Hill Community Center'}
                        </p>

                        {/* COUNTDOWN TIMER */}
                        <div className="countdown-widget">
                            <div className="time-block">
                                <span className="number">{timeLeft.d}</span>
                                <span className="label">DAYS</span>
                            </div>
                            <div className="time-block">
                                <span className="number">{timeLeft.h}</span>
                                <span className="label">HOURS</span>
                            </div>
                            <div className="time-block">
                                <span className="number">{timeLeft.m}</span>
                                <span className="label">MINS</span>
                            </div>
                            <div className="time-block">
                                <span className="number">{timeLeft.s}</span>
                                <span className="label">SECS</span>
                            </div>
                        </div>

                        <div className="hero-actions">
                            <button className="btn-hero-secondary" onClick={() => onNavigate('player-props')}>
                                🎯 PLACE PROP PICKS
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* THREE COLUMN GRID */}
            <div className="home-grid-layout">
                {/* COL 1: LATEST TEAM HEADLINES */}
                <div className="news-feed-column">
                    <h3 className="section-title">TEAM HEADLINES & RECAPS</h3>
                    <div className="news-card" onClick={() => onOpenGamePage('game-3')}>
                        <div className="news-tag">GAME RECAP</div>
                        <h4>Monkey Kings Capture First Victory in 41-38 Thriller vs Blue</h4>
                        <p>Arjun Virmani poured in 18 points (4 3PM) while Sidharth Dudyala blocked 4 shots and Vaishik Kota pulled down 12 rebounds to secure the win.</p>
                        <span className="news-date">AUG 03, 2026 • Volo League News</span>
                    </div>

                    <div className="news-card" onClick={() => onOpenPlayerBio('arjun-virmani')}>
                        <div className="news-tag">PLAYER OF THE WEEK</div>
                        <h4>Arjun Virmani Named Volo Men's League Player of the Week</h4>
                        <p>Averaging 13.3 PPG with a team-high 7 three-pointers across 3 games, Virmani has been a force on the wing.</p>
                        <span className="news-date">AUG 05, 2026 • Team Spotlight</span>
                    </div>

                    <div className="news-card" onClick={() => onOpenFilmPage ? onOpenFilmPage('season-2-game-3') : onNavigate('film')}>
                        <div className="news-tag">GAME FILM</div>
                        <h4>Watch Full Game Highlights from Victory over Team Blue</h4>
                        <p>Re-live every big defensive block and clutch 3-pointer from Nanjing's baseline camera breakdown.</p>
                        <span className="news-date">AUG 04, 2026 • Film Room</span>
                    </div>
                </div>

                {/* COL 2: TEAM STAT LEADERS */}
                <div className="leaders-column">
                    <h3 className="section-title">SEASON STAT LEADERS</h3>
                    
                    {statLeaders && statLeaders.pts && (
                        <div className="leader-box" onClick={() => onOpenPlayerBio(statLeaders.pts.slug)}>
                            <div className="leader-meta">
                                <span className="category">POINTS PER GAME</span>
                                <span className="stat-val gold-text">{statLeaders.pts.val} PPG</span>
                            </div>
                            <div className="leader-player-row">
                                <img src={statLeaders.pts.img} alt={statLeaders.pts.name} />
                                <div>
                                    <strong>{statLeaders.pts.name}</strong>{" "}
                                    <span>{statLeaders.pts.jersey} • {statLeaders.pts.pos}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {statLeaders && statLeaders.reb && (
                        <div className="leader-box" onClick={() => onOpenPlayerBio(statLeaders.reb.slug)}>
                            <div className="leader-meta">
                                <span className="category">REBOUNDS PER GAME</span>
                                <span className="stat-val">{statLeaders.reb.val} RPG</span>
                            </div>
                            <div className="leader-player-row">
                                <img src={statLeaders.reb.img} alt={statLeaders.reb.name} />
                                <div>
                                    <strong>{statLeaders.reb.name}</strong>{" "}
                                    <span>{statLeaders.reb.jersey} • {statLeaders.reb.pos}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {statLeaders && statLeaders.ast && (
                        <div className="leader-box" onClick={() => onOpenPlayerBio(statLeaders.ast.slug)}>
                            <div className="leader-meta">
                                <span className="category">ASSISTS PER GAME</span>
                                <span className="stat-val">{statLeaders.ast.val} APG</span>
                            </div>
                            <div className="leader-player-row">
                                <img src={statLeaders.ast.img} alt={statLeaders.ast.name} />
                                <div>
                                    <strong>{statLeaders.ast.name}</strong>{" "}
                                    <span>{statLeaders.ast.jersey} • {statLeaders.ast.pos}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* COL 3: FAN POLL & LEADERBOARD */}
                <div className="sidebar-column">
                    <div className="poll-card-box">
                        <h3>FAN POLL OF THE WEEK</h3>
                        <p className="poll-question">Who will be the top scorer in the upcoming matchup vs Kesslers Kingsmen?</p>
                        <div className="poll-options">
                            {['Arjun Virmani', 'Kevin Chen', 'Brendan Wong', 'Max Lee'].map(opt => {
                                const count = getVoteCount(opt);
                                const total = getTotalVotes();
                                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                const isMyVote = currentUser && pollVotes[currentUser.uid] === opt;
                                
                                return (
                                    <button 
                                        key={opt}
                                        className={`poll-opt-btn ${hasVoted ? 'voted-mode' : ''} ${isMyVote ? 'my-pick' : ''}`}
                                        onClick={() => !hasVoted && handlePollVote(opt)}
                                        disabled={hasVoted}
                                        style={{ position: 'relative', overflow: 'hidden', display: 'block', width: '100%', textAlign: 'left' }}
                                    >
                                        <span style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <span>{opt} {isMyVote ? '✓' : ''}</span>
                                            {hasVoted && <span>{pct}% ({count})</span>}
                                        </span>
                                        {hasVoted && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0, left: 0, bottom: 0,
                                                width: `${pct}%`,
                                                background: 'var(--gold-accent)',
                                                opacity: 0.2,
                                                zIndex: 1
                                            }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="leaderboard-card-box">
                        <h3>FAN PROPS LEADERBOARD</h3>
                        <div className="lb-rows">
                            {leaderboard.length > 0 ? leaderboard.map((user, idx) => {
                                const isMe = currentUser && currentUser.uid === user.uid;
                                const isGold = idx === 0;
                                return (
                                    <div 
                                        key={user.uid} 
                                        className={`lb-row ${isGold ? 'gold' : ''} ${isMe ? 'highlight' : ''}`}
                                        style={{ display: 'flex', justifyContent: 'space-between' }}
                                    >
                                        <span>{idx + 1}. {user.name || 'Anonymous'}{isMe ? ' (You)' : ''}</span>
                                        <strong>{(user.tokens || 0).toLocaleString()} PTS</strong>
                                    </div>
                                );
                            }) : (
                                <div style={{ textAlign: 'center', padding: '1rem', color: '#94A3B8' }}>Loading leaderboard...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
