import React, { useState, useEffect } from 'react';
import { DATA_PROPS } from '../data/teamData';
import { Target, CheckCircle2 } from 'lucide-react';
import { submitParlay, getUserParlays, adminSettleParlays } from '../firebaseDb';

export default function PlayerPropsPage({ currentUser, onUpdateTokens }) {
    const [activeTab, setActiveTab] = useState('props'); // 'props' or 'lineups'
    const [selectedProps, setSelectedProps] = useState({});
    const [wager, setWager] = useState(100);
    const [myParlays, setMyParlays] = useState([]);
    const [loadingParlays, setLoadingParlays] = useState(false);

    useEffect(() => {
        if (currentUser && activeTab === 'lineups') {
            setLoadingParlays(true);
            getUserParlays(currentUser.uid).then(data => {
                setMyParlays(data);
                setLoadingParlays(false);
            }).catch(e => {
                console.error(e);
                setLoadingParlays(false);
            });
        }
    }, [currentUser, activeTab]);

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

    const keys = Object.keys(selectedProps);
    const legCount = keys.length;

    const getMultiplier = (count) => {
        if (count === 2) return 3;
        if (count === 3) return 5;
        if (count === 4) return 10;
        return 0; // Invalid
    };

    const multiplier = getMultiplier(legCount);
    const potentialPayout = wager * multiplier;

    const handleSubmit = async () => {
        if (!currentUser) {
            alert('You must be signed in to submit a lineup!');
            return;
        }
        if (legCount < 2 || legCount > 4) {
            alert('Please select 2, 3, or 4 props to form a valid lineup!');
            return;
        }
        if (wager <= 0 || isNaN(wager)) {
            alert('Please enter a valid wager amount!');
            return;
        }
        if (currentUser.tokens < wager) {
            alert(`You don't have enough points! Your balance is ${currentUser.tokens} PTS.`);
            return;
        }

        const legs = keys.map(id => {
            const p = DATA_PROPS.find((item) => item.id === id);
            return {
                propId: id,
                player: p.player,
                stat: p.stat,
                line: p.line,
                pick: selectedProps[id]
            };
        });

        const parlayData = {
            uid: currentUser.uid,
            timestamp: Date.now(),
            wager: Number(wager),
            multiplier,
            potentialPayout,
            legs,
            status: 'OPEN'
        };

        try {
            await submitParlay(parlayData);
            // Deduct tokens
            onUpdateTokens(-Number(wager));
            alert(`Success! Your lineup has been locked in! (-${wager} PTS)`);
            setSelectedProps({});
            setWager(100);
            setActiveTab('lineups');
        } catch (error) {
            console.error(error);
            alert('Failed to submit lineup. Please try again.');
        }
    };

    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>PLAYER PROPS</h2>
                <div className="filter-group">
                    <button
                        className={`filter-chip ${activeTab === 'props' ? 'active' : ''}`}
                        onClick={() => setActiveTab('props')}
                    >
                        PROPS BOARD
                    </button>
                    <button
                        className={`filter-chip ${activeTab === 'lineups' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lineups')}
                    >
                        MY LINEUPS
                    </button>
                    
                    {/* ADMIN SETTLE BUTTON (Only visible to ogmudb) */}
                    {currentUser && currentUser.username === 'ogmudb' && (
                        <button
                            className="filter-chip"
                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.5)' }}
                            onClick={async () => {
                                if (confirm('Are you sure you want to run the parlay settlement script?')) {
                                    try {
                                        const res = await adminSettleParlays();
                                        alert(res);
                                        // Refresh the page to update token balances immediately
                                        window.location.reload();
                                    } catch (err) {
                                        console.error(err);
                                        alert('Error settling parlays: ' + err.message);
                                    }
                                }
                            }}
                        >
                            ADMIN: SETTLE PARLAYS
                        </button>
                    )}
                </div>
            </div>

            {activeTab === 'props' && (
                <div className="props-page-layout">
                    {/* PROPS SELECTION GRID */}
                    <div className="props-cards-column">
                        <h3 className="section-title">UPCOMING GAME PLAYER PROPS (VS KESSLERS KINGSMEN)</h3>
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
                            <h3>📋 YOUR LINEUP</h3>

                            <div className="slip-items-container">
                                {keys.length === 0 ? (
                                    <p className="empty-slip-text">
                                        Select 2 to 4 props to build your lineup!
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
                                <div className="slip-row" style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.85rem' }}>WAGER AMOUNT:</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input 
                                            type="number" 
                                            value={wager} 
                                            onChange={(e) => setWager(e.target.value)}
                                            style={{ 
                                                width: '80px', 
                                                background: 'rgba(0,0,0,0.3)', 
                                                border: '1px solid var(--border-color)', 
                                                color: 'white', 
                                                padding: '0.3rem 0.5rem', 
                                                borderRadius: '4px',
                                                textAlign: 'right'
                                            }}
                                            min="10"
                                        />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)' }}>PTS</span>
                                    </div>
                                </div>
                                <div className="slip-row">
                                    <span>TOTAL PICKS:</span>
                                    <strong className="gold-text">{legCount} {legCount > 0 && multiplier > 0 ? `(${multiplier}x)` : ''}</strong>
                                </div>
                                <div className="slip-row">
                                    <span>POTENTIAL PAYOUT:</span>
                                    <strong className="gold-text">{multiplier > 0 ? potentialPayout.toLocaleString() : '---'} PTS</strong>
                                </div>

                                {legCount > 0 && multiplier === 0 && (
                                    <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>
                                        Lineups must have exactly 2, 3, or 4 picks.
                                    </div>
                                )}

                                <button 
                                    className="btn-espn-gold" 
                                    style={{ width: '100%', marginTop: '1rem', opacity: multiplier === 0 ? 0.5 : 1 }} 
                                    onClick={handleSubmit}
                                    disabled={multiplier === 0}
                                >
                                    LOCK IN LINEUP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'lineups' && (
                <div style={{ marginTop: '2rem' }}>
                    {!currentUser ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--navy-panel)', borderRadius: '8px' }}>
                            <p>Please sign in to view your lineups.</p>
                        </div>
                    ) : loadingParlays ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading lineups...</div>
                    ) : myParlays.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--navy-panel)', borderRadius: '8px' }}>
                            <p>You haven't placed any lineups yet!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {myParlays.map(parlay => (
                                <div key={parlay.id} style={{ background: 'var(--navy-panel)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{new Date(parlay.timestamp).toLocaleDateString()}</div>
                                            <strong className="gold-text">{parlay.legs.length}-Pick Entry</strong>
                                        </div>
                                        <div style={{ 
                                            background: parlay.status === 'OPEN' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.1)', 
                                            color: parlay.status === 'OPEN' ? '#34D399' : '#fff',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {parlay.status}
                                        </div>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        {parlay.legs.map((leg, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: idx < parlay.legs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{leg.player}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{leg.stat} ({leg.line})</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{leg.pick}</div>
                                                    {leg.status && (
                                                        <div style={{ 
                                                            fontSize: '0.75rem', 
                                                            marginTop: '4px',
                                                            color: leg.status === 'WON' ? '#34D399' : leg.status === 'LOST' ? '#EF4444' : '#94A3B8'
                                                        }}>
                                                            {leg.status === 'VOID' ? 'VOID (DNP)' : `${leg.status} (Actual: ${leg.actual})`}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>WAGER</div>
                                            <strong>{parlay.wager} PTS</strong>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>PAYOUT TO WIN</div>
                                            <strong className="gold-text">{parlay.potentialPayout.toLocaleString()} PTS</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
