import React, { useState } from 'react';
import { getMergedRoster, getPlayerSlug } from '../data/teamData';

export default function RosterPage({ activeSeason, customPlayerBios = {}, onOpenPlayerBio }) {
    const [posFilter, setPosFilter] = useState('all');

    const sourceData = getMergedRoster(activeSeason, customPlayerBios);

    const list = sourceData.filter(p => {
        if (posFilter === 'guard') return p.pos.includes('Guard');
        if (posFilter === 'forward') return p.pos.includes('Forward');
        if (posFilter === 'center') return p.pos.includes('Center');
        return true;
    });

    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>{activeSeason === 'season1' ? 'SEASON 1 OFFICIAL TEAM ROSTER' : 'SEASON 2 OFFICIAL TEAM ROSTER'}</h2>
                <div className="filter-group">
                    <button className={`filter-chip ${posFilter === 'all' ? 'active' : ''}`} onClick={() => setPosFilter('all')}>ALL POSITIONS</button>
                    <button className={`filter-chip ${posFilter === 'guard' ? 'active' : ''}`} onClick={() => setPosFilter('guard')}>GUARDS</button>
                    <button className={`filter-chip ${posFilter === 'forward' ? 'active' : ''}`} onClick={() => setPosFilter('forward')}>FORWARDS</button>
                    <button className={`filter-chip ${posFilter === 'center' ? 'active' : ''}`} onClick={() => setPosFilter('center')}>CENTERS</button>
                </div>
            </div>

            <div className="roster-grid-layout" id="roster-grid">
                {list.map((p) => {
                    const slug = getPlayerSlug(p.name);
                    return (
                        <div key={p.id} className="player-card-box" onClick={() => onOpenPlayerBio(slug)}>
                            <div className="player-img-container">
                                <img src={p.img} alt={p.name} />
                                <span className="jersey-badge">{p.jersey}</span>
                            </div>
                            <div className="player-details-box">
                                <h3>{p.name}</h3>
                                <span className="pos-tag">{p.pos} • {p.height}</span>
                                <div className="mini-stats-grid">
                                    <div className="mini-stat"><label>PPG</label><span>{p.ppg}</span></div>
                                    <div className="mini-stat"><label>RPG</label><span>{p.rpg}</span></div>
                                    <div className="mini-stat"><label>APG</label><span>{p.apg}</span></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
