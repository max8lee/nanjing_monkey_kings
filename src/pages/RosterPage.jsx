import React, { useState } from 'react';
import { getMergedRoster, getPlayerSlug } from '../data/teamData';
import { LayoutGrid, List } from 'lucide-react';

export default function RosterPage({ activeSeason, customPlayerBios = {}, seasonLogs, onOpenPlayerBio }) {
    const [posFilter, setPosFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState('desc');

    const sourceData = getMergedRoster(activeSeason, customPlayerBios, seasonLogs);

    const list = sourceData.filter(p => {
        if (posFilter === 'guard') return p.pos.includes('Guard');
        if (posFilter === 'forward') return p.pos.includes('Forward');
        if (posFilter === 'center') return p.pos.includes('Center');
        return true;
    });

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    const sortedList = [...list].sort((a, b) => {
        if (!sortKey) return 0;
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (['ppg', 'rpg', 'apg'].includes(sortKey)) {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
        }

        if (sortKey === 'height') {
            const parseHeight = (ht) => {
                if (!ht) return 0;
                const parts = ht.split("'");
                if (parts.length === 2) {
                    const feet = parseInt(parts[0]) || 0;
                    const inches = parseInt(parts[1].replace('"', '')) || 0;
                    return feet * 12 + inches;
                }
                return 0;
            };
            valA = parseHeight(valA);
            valB = parseHeight(valB);
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>{activeSeason === 'season1' ? 'SEASON 1 ROSTER' : 'SEASON 2 ROSTER'}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="view-toggle" style={{ display: 'flex', background: 'var(--navy-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                        <button 
                            title="Grid View"
                            style={{ background: viewMode === 'grid' ? 'var(--gold-accent)' : 'transparent', border: 'none', padding: '0.5rem 0.75rem', color: viewMode === 'grid' ? '#000' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button 
                            title="List View"
                            style={{ background: viewMode === 'list' ? 'var(--gold-accent)' : 'transparent', border: 'none', padding: '0.5rem 0.75rem', color: viewMode === 'list' ? '#000' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={16} />
                        </button>
                    </div>
                    <div className="filter-group">
                        <button className={`filter-chip ${posFilter === 'all' ? 'active' : ''}`} onClick={() => setPosFilter('all')}>ALL POSITIONS</button>
                        <button className={`filter-chip ${posFilter === 'guard' ? 'active' : ''}`} onClick={() => setPosFilter('guard')}>GUARDS</button>
                        <button className={`filter-chip ${posFilter === 'forward' ? 'active' : ''}`} onClick={() => setPosFilter('forward')}>FORWARDS</button>
                        <button className={`filter-chip ${posFilter === 'center' ? 'active' : ''}`} onClick={() => setPosFilter('center')}>CENTERS</button>
                    </div>
                </div>
            </div>

            {viewMode === 'grid' ? (
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
            ) : (
                <div className="schedule-table-wrapper" style={{ marginTop: '1rem' }}>
                    <table className="espn-table">
                        <thead>
                            <tr>
                                <th className="sortable-header" onClick={() => handleSort('name')}>PLAYER {sortKey === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                <th className="sortable-header" onClick={() => handleSort('pos')}>POS {sortKey === 'pos' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                <th className="sortable-header" onClick={() => handleSort('height')}>HT {sortKey === 'height' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                <th className="sortable-header" onClick={() => handleSort('ppg')}>PPG {sortKey === 'ppg' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                <th className="sortable-header" onClick={() => handleSort('rpg')}>RPG {sortKey === 'rpg' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                <th className="sortable-header" onClick={() => handleSort('apg')}>APG {sortKey === 'apg' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedList.map((p) => {
                                const slug = getPlayerSlug(p.name);
                                return (
                                    <tr key={p.id} onClick={() => onOpenPlayerBio(slug)} style={{ cursor: 'pointer' }} className="hover-row">
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <img src={p.img} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }} />
                                                <div>
                                                    <strong className="player-boxscore-name">{p.name}</strong>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>#{p.jersey}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{p.pos}</td>
                                        <td>{p.height}</td>
                                        <td>{p.ppg}</td>
                                        <td>{p.rpg}</td>
                                        <td>{p.apg}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
