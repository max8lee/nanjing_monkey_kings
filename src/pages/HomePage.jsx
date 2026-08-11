import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Trophy, Flame, Play, HelpCircle, ArrowRight } from 'lucide-react';

export default function HomePage({ activeSeason, onNavigate, onOpenPlayerBio, onOpenGamePage, onOpenTicketModal }) {
    const [timeLeft, setTimeLeft] = useState({ d: '03', h: '14', m: '22', s: '45' });

    useEffect(() => {
        let totalSeconds = (3 * 24 * 3600) + (14 * 3600) + (22 * 60) + 45;
        const interval = setInterval(() => {
            if (totalSeconds <= 0) return;
            totalSeconds--;

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
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handlePollVote = (opt) => {
        alert(`🔥 Thanks for voting! Your pick for ${opt.toUpperCase()} has been registered in the Nanjing fan poll.`);
    };

    return (
        <div className="page-section active">
            {/* HERO SPOTLIGHT BANNER */}
            <div className="hero-banner-card">
                <div className="hero-content">
                    <span className="hero-badge">
                        <Flame size={14} style={{ marginRight: '4px' }} /> NEXT MATCHUP SPOTLIGHT
                    </span>
                    <h2>MONKEY KINGS VS GOLD LIONS</h2>
                    <p className="hero-match-meta">
                        <Calendar size={14} /> AUG 15 • 19:35 PM PST &nbsp;|&nbsp; <MapPin size={14} /> Telegraph Hill Community Center
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
                        <button className="btn-hero-primary" onClick={onOpenTicketModal}>
                            🎟️ RESERVE COURTSIDE SEATS
                        </button>
                        <button className="btn-hero-secondary" onClick={() => onNavigate('player-props')}>
                            🎯 PLACE PROP PICKS
                        </button>
                    </div>
                </div>
            </div>

            {/* THREE COLUMN GRID */}
            <div className="home-grid-layout">
                {/* COL 1: LATEST TEAM HEADLINES */}
                <div className="news-feed-column">
                    <h3 className="section-title">📰 TEAM HEADLINES & RECAPS</h3>
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

                    <div className="news-card" onClick={() => onNavigate('film')}>
                        <div className="news-tag">GAME FILM</div>
                        <h4>Watch Full Game Highlights from Victory over Team Blue</h4>
                        <p>Re-live every big defensive block and clutch 3-pointer from Nanjing's baseline camera breakdown.</p>
                        <span className="news-date">AUG 04, 2026 • Film Room</span>
                    </div>
                </div>

                {/* COL 2: TEAM STAT LEADERS */}
                <div className="leaders-column">
                    <h3 className="section-title">⭐ SEASON STAT LEADERS</h3>
                    
                    <div className="leader-box" onClick={() => onOpenPlayerBio('arjun-virmani')}>
                        <div className="leader-meta">
                            <span className="category">POINTS PER GAME</span>
                            <span className="stat-val gold-text">13.3 PPG</span>
                        </div>
                        <div className="leader-player-row">
                            <img src="assets/lin_wei.jpg" alt="Arjun Virmani" />
                            <div>
                                <strong>Arjun Virmani</strong>
                                <span>#10 • Guard</span>
                            </div>
                        </div>
                    </div>

                    <div className="leader-box" onClick={() => onOpenPlayerBio('vaishik-kota')}>
                        <div className="leader-meta">
                            <span className="category">REBOUNDS PER GAME</span>
                            <span className="stat-val">12.0 RPG</span>
                        </div>
                        <div className="leader-player-row">
                            <img src="assets/full-logo.webp" alt="Vaishik Kota" />
                            <div>
                                <strong>Vaishik Kota (Vee)</strong>
                                <span>#14 • Center</span>
                            </div>
                        </div>
                    </div>

                    <div className="leader-box" onClick={() => onOpenPlayerBio('brendan-wong')}>
                        <div className="leader-meta">
                            <span className="category">ASSISTS PER GAME</span>
                            <span className="stat-val">3.0 APG</span>
                        </div>
                        <div className="leader-player-row">
                            <img src="assets/lin_wei.jpg" alt="Brendan Wong" />
                            <div>
                                <strong>Brendan Wong</strong>
                                <span>#3 • Guard</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COL 3: FAN POLL & LEADERBOARD */}
                <div className="sidebar-column">
                    <div className="poll-card-box">
                        <h3>🔥 FAN POLL OF THE WEEK</h3>
                        <p className="poll-question">Who will be the top scorer in the upcoming matchup vs Gold Lions?</p>
                        <div className="poll-options">
                            <button className="poll-opt-btn" onClick={() => handlePollVote('Arjun Virmani')}>Arjun Virmani (#10)</button>
                            <button className="poll-opt-btn" onClick={() => handlePollVote('Kevin Chen')}>Kevin Chen (#2)</button>
                            <button className="poll-opt-btn" onClick={() => handlePollVote('Brendan Wong')}>Brendan Wong (#3)</button>
                            <button className="poll-opt-btn" onClick={() => handlePollVote('Max Lee')}>Max Lee (#8)</button>
                        </div>
                    </div>

                    <div className="leaderboard-card-box">
                        <h3>🏆 FAN PROPS LEADERBOARD</h3>
                        <div className="lb-rows">
                            <div className="lb-row gold">
                                <span>1. Alex Rivera</span>
                                <strong>3,450 PTS</strong>
                            </div>
                            <div className="lb-row">
                                <span>2. Jordan Chen</span>
                                <strong>2,900 PTS</strong>
                            </div>
                            <div className="lb-row">
                                <span>3. Taylor Swift</span>
                                <strong>2,450 PTS</strong>
                            </div>
                            <div className="lb-row highlight">
                                <span>4. You (Guest Fan)</span>
                                <strong>1,250 PTS</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
