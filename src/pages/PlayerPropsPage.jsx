import React, { useState } from 'react';
import { DATA_PROPS } from '../data/teamData';
import { Target, CheckCircle2 } from 'lucide-react';

export default function PlayerPropsPage({ currentUser, onUpdateTokens }) {
    const [selectedProps, setSelectedProps] = useState({});

    const togglePick = (propId, choice) => {
        setSelectedProps((prev) => {
            const next = { ...prev };
            if (next[propId] === choice) {
                delete next[propId];
            } else {
                next[propId] = choice;
            }
            return next;
        });
    };

    const handleSubmit = () => {
        const count = Object.keys(selectedProps).length;
        if (count === 0) {
            alert('Please select at least 1 prop prediction before submitting your slip!');
            return;
        }

        const reward = count * 350;
        onUpdateTokens(reward);
        alert(`🎯 Success! Your ${count} prop predictions have been placed for tip-off! (+${reward} PTS added to your profile)`);
        setSelectedProps({});
    };

    const keys = Object.keys(selectedProps);

    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>🎯 FAN PLAYER PROPS & PREDICTION SLIPS</h2>
            </div>

            <div className="props-page-layout">
                {/* PROPS SELECTION GRID */}
                <div className="props-cards-column">
                    <h3 className="section-title">UPCOMING GAME PLAYER PROPS (VS GOLD LIONS)</h3>
                    <div className="props-cards-grid">
                        {DATA_PROPS.map((p) => {
                            const currentPick = selectedProps[p.id];
                            return (
                                <div key={p.id} className="prop-card">
                                    <div className="prop-player-meta">
                                        <h4>{p.player}</h4>
                                        <div className="prop-line">{p.stat} — Line: <strong>{p.line}</strong></div>
                                        <span className="prop-stat-desc">{p.matchup}</span>
                                    </div>
                                    <div className="prop-btns">
                                        <button
                                            className={`btn-pick ${currentPick === 'OVER' ? 'selected-over' : ''}`}
                                            onClick={() => togglePick(p.id, 'OVER')}
                                        >
                                            OVER {p.line}
                                        </button>
                                        <button
                                            className={`btn-pick ${currentPick === 'UNDER' ? 'selected-under' : ''}`}
                                            onClick={() => togglePick(p.id, 'UNDER')}
                                        >
                                            UNDER {p.line}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* BET SLIP SUMMARY SIDEBAR */}
                <div className="betslip-sidebar-column">
                    <div className="betslip-card">
                        <h3>📋 YOUR FAN PREDICTION SLIP</h3>

                        <div className="slip-items-container">
                            {keys.length === 0 ? (
                                <p className="empty-slip-text">
                                    No prop picks selected yet. Click OVER or UNDER on any player prop card to build your slip!
                                </p>
                            ) : (
                                keys.map((id) => {
                                    const p = DATA_PROPS.find((item) => item.id === id);
                                    const pick = selectedProps[id];
                                    return (
                                        <div key={id} className="slip-item">
                                            <div>
                                                <strong>{p.player}</strong>
                                                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{p.stat}</div>
                                            </div>
                                            <span className="pick-val">{pick} {p.line}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="slip-footer">
                            <div className="slip-row">
                                <span>TOTAL PICKS:</span>
                                <strong className="gold-text">{keys.length}</strong>
                            </div>
                            <div className="slip-row">
                                <span>POTENTIAL REWARD:</span>
                                <strong className="gold-text">{keys.length * 350} PTS</strong>
                            </div>

                            <button className="btn-espn-gold" style={{ width: '100%', marginTop: '1rem' }} onClick={handleSubmit}>
                                SUBMIT PREDICTION SLIP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
